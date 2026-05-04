#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiManager.h> 
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Змінні для кастомних параметрів
WiFiManagerParameter custom_user_id("user", "Введіть ваш User ID", "", 10);
WiFiManagerParameter custom_server_url("server", "URL сервера (напр. https://my-app.onrender.com)", "http://192.168.31.102:5000", 100);

void setup() {
  Serial.begin(115200);
  
  dht.begin();

  WiFiManager wm;
  wm.resetSettings();
  // Додаємо поля в інтерфейс налаштування
  wm.addParameter(&custom_user_id);
  wm.addParameter(&custom_server_url);

  // Назва мережі, яку створить ESP32 для налаштування
  Serial.println("Запуск точки доступу для налаштування...");
  if (!wm.autoConnect("SmartSensor_Setup")) {
    Serial.println("Помилка підключення. Перезавантаження...");
    delay(3000);
    ESP.restart();
  }

  Serial.println("Wi-Fi підключено!");
  Serial.print("User ID: "); Serial.println(custom_user_id.getValue());
  Serial.print("Server: "); Serial.println(custom_server_url.getValue());
}

// Функція отримання унікального ID (ChipID)
String getChipID() {
  uint64_t chipid = ESP.getEfuseMac();
  return String((uint32_t)(chipid >> 32), HEX) + String((uint32_t)chipid, HEX);
}

void loop() {
  float t = dht.readTemperature();
  if (isnan(t)) {
    Serial.println("Помилка датчика!");
    delay(2000);
    return;
  }

  static unsigned long lastUpdate = 0;
  // Відправляємо дані кожні 30 секунд (або при аварії)
  if (millis() - lastUpdate > 30000 || t > 27.0) { 
    sendToServer(t, t > 32.0); // 32.0 - поріг алерту
    lastUpdate = millis();
  }
  
  delay(1000);
}
void sendToServer(float temp, bool isAlert) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String serverPath = String(custom_server_url.getValue()) + "/api/sensors/update";
    
    http.begin(serverPath);
    http.addHeader("Content-Type", "application/json");

    // Отримуємо значення, якщо воно порожнє - ставимо "0"
    String uid = String(custom_user_id.getValue());
    if (uid.length() == 0) uid = "0"; 

    String jsonPayload = "{";
    jsonPayload += "\"chipId\":\"" + getChipID() + "\",";
    jsonPayload += "\"userId\":" + uid + ","; 
    jsonPayload += "\"currentTemp\":" + String(temp) + ",";
    jsonPayload += "\"isAlert\":" + String(isAlert ? "true" : "false") + ",";
    jsonPayload += "\"sensorData\":\"Температура: " + String(temp) + "°C\"";
    jsonPayload += "}";

    int httpResponseCode = http.POST(jsonPayload);
    Serial.println("Payload: " + jsonPayload); 
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    
    http.end();
  }
}