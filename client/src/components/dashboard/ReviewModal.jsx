import React from 'react';

export default function ReviewModal({ showReviewModal, setShowReviewModal, reviewData, setReviewData, handleSubmitReview }) {
  if (!showReviewModal) return null;
  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-warning text-dark">
            <h5 className="modal-title">Ваш відгук</h5>
            <button type="button" className="btn-close" onClick={() => setShowReviewModal(false)}></button>
          </div>
          <form onSubmit={handleSubmitReview}>
            <div className="modal-body text-center">
              <div className="star-rating mb-3">
                {[5, 4, 3, 2, 1].map(num => (
                  <React.Fragment key={num}>
                    <input type="radio" id={`star-${num}`} name="rating" value={num} 
                      checked={reviewData.rating === num} onChange={() => setReviewData({...reviewData, rating: num})} />
                    <label htmlFor={`star-${num}`}>★</label>
                  </React.Fragment>
                ))}
              </div>
              <textarea className="form-control" rows="3" placeholder="Ваш коментар..." 
                value={reviewData.comment} onChange={e => setReviewData({...reviewData, comment: e.target.value})}></textarea>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowReviewModal(false)}>Закрити</button>
              <button type="submit" className="btn btn-warning">Відправити</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}