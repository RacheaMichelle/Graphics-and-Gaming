import React, { useState, useEffect } from 'react';
import LazyReveal from '../components/LazyReveal';
import useReviewsService from '../services/useReviewsService';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    service: '',
    rating: 5,
    review: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const reviewsService = useReviewsService();

  useEffect(() => {
    loadReviews();
    const savedOwnerStatus = localStorage.getItem('reviews_owner');
    if (savedOwnerStatus === 'true') setIsOwner(true);
  }, []);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const loadedReviews = await reviewsService.loadReviews();
      setReviews(loadedReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOwnerLogin = () => {
    if (password === 'owner123') {
      setIsOwner(true);
      setShowLogin(false);
      setPassword('');
      localStorage.setItem('reviews_owner', 'true');
    } else {
      alert('Incorrect password');
    }
  };

  const handleOwnerLogout = () => {
    setIsOwner(false);
    localStorage.removeItem('reviews_owner');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.service.trim() || !formData.review.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        name: formData.name.trim(),
        service: formData.service,
        rating: parseInt(formData.rating),
        review: formData.review.trim(),
        location: formData.location.trim() || 'Kampala, Uganda',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        verified: true,
        ownerReply: null,
        replyDate: null
      };

      const result = await reviewsService.addReview(reviewData);
      
      if (result.success) {
        setReviews(prev => [result.review, ...prev]);
        setFormData({ name: '', service: '', rating: 5, review: '', location: '' });
        setShowReviewForm(false);
        alert('Thank you for your review!');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteReview = async (reviewId, event) => {
    if (!isOwner) return;
    event.stopPropagation();
    
    if (window.confirm('Delete this review?')) {
      try {
        await reviewsService.deleteReview(reviewId);
        setReviews(prev => prev.filter(review => review.id !== reviewId));
      } catch (error) {
        alert('Failed to delete review');
      }
    }
  };

  const submitOwnerReply = async (reviewId) => {
    if (!replyText.trim()) {
      alert('Please enter a reply');
      return;
    }

    try {
      const replyData = {
        ownerReply: replyText.trim(),
        replyDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      };

      await reviewsService.updateReview(reviewId, replyData);
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, ...replyData } : review
      ));
      setReplyingTo(null);
      setReplyText('');
      alert('Reply posted!');
    } catch (error) {
      alert('Failed to post reply');
    }
  };

  const getRatingStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0';

  return (
    <div className="reviews-page">
      <div className="page-hero">
        <div className="container">
          <LazyReveal threshold={0.1}>
            <h1>Client Reviews</h1>
            <p>What our clients say about their experience</p>
          </LazyReveal>
        </div>
      </div>

      <section className="reviews-section">
        <div className="container">
          {/* Owner Controls */}
          <div className="owner-bar">
            {!isOwner ? (
              <button className="owner-login-btn" onClick={() => setShowLogin(true)}>
                🔧 Owner Login
              </button>
            ) : (
              <div className="owner-mode">
                <span>👑 Owner Mode</span>
                <button className="logout-btn" onClick={handleOwnerLogout}>Logout</button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{reviews.length}</div>
              <div className="stat-label">Total Reviews</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{averageRating}</div>
              <div className="stat-label">Average Rating</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{reviews.filter(r => r.ownerReply).length}</div>
              <div className="stat-label">Owner Replies</div>
            </div>
          </div>

          {/* Write Review Button */}
          <div className="write-review">
            <button className="write-review-btn" onClick={() => setShowReviewForm(true)}>
              ✍️ Write a Review
            </button>
          </div>

          {/* Reviews Grid */}
          {isLoading ? (
            <div className="loading">Loading reviews...</div>
          ) : reviews.length > 0 ? (
            <div className="reviews-grid">
              {reviews.map((review, index) => (
                <LazyReveal key={review.id} threshold={0.3} delay={index * 100}>
                  <div className="review-card">
                    {isOwner && (
                      <button className="delete-btn" onClick={(e) => deleteReview(review.id, e)}>×</button>
                    )}
                    
                    <div className="review-header">
                      <div className="reviewer">
                        <div className="avatar">{review.name.charAt(0)}</div>
                        <div>
                          <h4>{review.name}</h4>
                          <span className="location">{review.location}</span>
                        </div>
                      </div>
                      <div className="meta">
                        <span className="date">{review.date}</span>
                        {review.verified && <span className="verified">✓ Verified</span>}
                      </div>
                    </div>

                    <div className="service-tag">{review.service}</div>
                    <div className="rating">{getRatingStars(review.rating)}</div>
                    <p className="review-text">"{review.review}"</p>

                    {review.ownerReply && (
                      <div className="owner-reply">
                        <strong>👑 Business Owner:</strong>
                        <p>{review.ownerReply}</p>
                        <small>{review.replyDate}</small>
                      </div>
                    )}

                    {isOwner && !review.ownerReply && replyingTo === review.id ? (
                      <div className="reply-form">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply..."
                          rows="3"
                        />
                        <div className="reply-buttons">
                          <button onClick={() => setReplyingTo(null)}>Cancel</button>
                          <button onClick={() => submitOwnerReply(review.id)}>Post Reply</button>
                        </div>
                      </div>
                    ) : isOwner && !review.ownerReply ? (
                      <button className="reply-btn" onClick={() => setReplyingTo(review.id)}>
                        💬 Reply
                      </button>
                    ) : null}
                  </div>
                </LazyReveal>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      </section>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="modal" onClick={() => setShowReviewForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Write a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <input type="text" name="name" placeholder="Your Name *" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <select name="service" value={formData.service} onChange={(e) => setFormData({...formData, service: e.target.value})} required>
                <option value="">Select Service *</option>
                <option>Graphic Design</option>
                <option>Photography</option>
                <option>Motion Picture</option>
                <option>Music Artworks</option>
                <option>Gaming Services</option>
              </select>
              <input type="text" name="location" placeholder="Your Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
              <div className="rating-select">
                <label>Rating:</label>
                {[1,2,3,4,5].map(star => (
                  <button type="button" key={star} className={star <= formData.rating ? 'star active' : 'star'} onClick={() => setFormData({...formData, rating: star})}>
                    {star <= formData.rating ? '★' : '☆'}
                  </button>
                ))}
              </div>
              <textarea name="review" placeholder="Your Review *" rows="4" value={formData.review} onChange={(e) => setFormData({...formData, review: e.target.value})} required></textarea>
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowReviewForm(false)}>Cancel</button>
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Review'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="modal" onClick={() => setShowLogin(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <h3>Owner Login</h3>
            <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleOwnerLogin()} />
            <div className="modal-buttons">
              <button onClick={() => setShowLogin(false)}>Cancel</button>
              <button onClick={handleOwnerLogin}>Login</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .reviews-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #115ca8 0%, #f1f5f9 100%);
        }
          // Add these styles to your ReviewsPage.jsx inside the <style jsx> section

/* Add/Update these styles for better text contrast */

.review-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  position: relative;
  box-shadow: 0 5px 15px rgba(156, 31, 31, 0.08);
  /* Add this for better readability */
  border: 1px solid #e2e8f0;
}

.review-text {
  color: #e117b8; /* Darker text instead of #334155 */
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 1rem;
  font-weight: 500;
}

.reviewer h4 {
  margin: 0 0 4px 0;
  color: #0f172a; /* Darker color */
  font-weight: 700;
  font-size: 1.1rem;
}

.location {
  font-size: 0.85rem;
  color: #475569; /* Darker than before */
  font-weight: 500;
}

.date {
  font-size: 0.8rem;
  color: #64748b;
  display: block;
  font-weight: 500;
}

.service-tag {
  background: linear-gradient(135deg, #0f37e8 0%, #764ba2 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  display: inline-block;
  margin-bottom: 12px;
  font-weight: 600;
}

.rating {
  font-size: 1.3rem;
  margin-bottom: 12px;
  color: #f59e0b;
  letter-spacing: 2px;
}

.owner-reply {
  background: #f1f5f9; /* Lighter background */
  padding: 15px;
  border-radius: 10px;
  margin-top: 15px;
  border-left: 3px solid #123dfe;
}

.owner-reply strong {
  color: #1e293b;
  display: block;
  margin-bottom: 8px;
  font-weight: 700;
}

.owner-reply p {
  color: #334155;
  margin: 0 0 8px 0;
  line-height: 1.5;
  font-size: 0.95rem;
}

.owner-reply small {
  color: #64748b;
  font-size: 0.75rem;
}

/* Modal styles - also update text contrast */
.modal-content h3 {
  color: #0f172a;
  font-weight: 700;
  margin-bottom: 20px;
}

.modal-content input,
.modal-content select,
.modal-content textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #1e293b;
  font-size: 0.95rem;
}

.modal-content input::placeholder,
.modal-content textarea::placeholder {
  color: #94a3b8;
}

.modal-content label {
  color: #334155;
  font-weight: 500;
  margin-bottom: 5px;
  display: block;
}

/* Empty state text */
.empty-state p {
  color: #cb17e3;
  font-size: 1.1rem;
  font-weight: 500;
}

/* Loading text */
.loading {
  text-align: center;
  padding: 60px;
  color: #475569;
  font-size: 1.1rem;
  font-weight: 500;
}

/* Status messages */
.status-message {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-weight: 500;
}

.status-message.success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
}

.status-message.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

        .page-hero {
          background: linear-gradient(135deg, #0e3aff 0%, #764ba2 100%);
          color: white;
          padding: 120px 0 80px;
          text-align: center;
        }

        .page-hero h1 {
          font-size: 3.5rem;
          margin-bottom: 16px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .reviews-section {
          padding: 60px 0;
        }

        .owner-bar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 40px;
        }

        .owner-login-btn, .logout-btn {
          background: #2adf02;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .owner-mode {
          display: flex;
          gap: 10px;
          align-items: center;
          background: white;
          padding: 10px 20px;
          border-radius: 8px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          padding: 30px;
          text-align: center;
          border-radius: 15px;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #0e38f3;
        }

        .write-review {
          text-align: center;
          margin-bottom: 40px;
        }

        .write-review-btn {
          background: linear-gradient(135deg, #133efa 0%, #764ba2 100%);
          color: white;
          padding: 15px 30px;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          cursor: pointer;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 30px;
        }

        .review-card {
          background: white;
          padding: 25px;
          border-radius: 15px;
          position: relative;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }

        .delete-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: #ef4444;
          color: white;
          border: none;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .review-card:hover .delete-btn {
          opacity: 1;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .reviewer {
          display: flex;
          gap: 12px;
        }

        .avatar {
          width: 45px;
          height: 45px;
          background: #2e52f2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }

        .reviewer h4 {
          margin: 0 0 4px 0;
        }

        .location {
          font-size: 0.85rem;
          color: #64748b;
        }

        .meta {
          text-align: right;
        }

        .date {
          font-size: 0.8rem;
          color: #94a3b8;
          display: block;
        }

        .verified {
          font-size: 0.7rem;
          color: #10b981;
        }

        .service-tag {
          background: #12f346;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          display: inline-block;
          margin-bottom: 12px;
        }

        .rating {
          font-size: 1.2rem;
          margin-bottom: 12px;
        }

        .review-text {
          color: #334155;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .owner-reply {
          background: #f8fafc;
          padding: 15px;
          border-radius: 10px;
          margin-top: 15px;
          border-left: 3px solid #667eea;
        }

        .reply-btn {
          background: #667eea;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 15px;
        }

        .reply-form {
          margin-top: 15px;
        }

        .reply-form textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-bottom: 10px;
        }

        .reply-buttons {
          display: flex;
          gap: 10px;
        }

        .reply-buttons button {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .reply-buttons button:first-child {
          background: #94a3b8;
          color: white;
        }

        .reply-buttons button:last-child {
          background: #667eea;
          color: white;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 20px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content.small {
          max-width: 350px;
        }

        .modal-content input,
        .modal-content select,
        .modal-content textarea {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .rating-select {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 15px;
        }

        .star {
          font-size: 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #cbd5e1;
        }

        .star.active {
          color: #f59e0b;
        }

        .modal-buttons {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .modal-buttons button {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .modal-buttons button:first-child {
          background: #94a3b8;
          color: white;
        }

        .modal-buttons button:last-child {
          background: #667eea;
          color: white;
        }

        .loading, .empty-state {
          text-align: center;
          padding: 60px;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .page-hero {
            padding: 100px 0 60px;
          }

          .page-hero h1 {
            font-size: 2.5rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .reviews-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ReviewsPage;