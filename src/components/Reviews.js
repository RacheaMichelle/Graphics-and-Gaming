import React, { useState, useEffect } from 'react';
import useReviewsService from '../services/useReviewsService';

const Reviews = () => {
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

  // Load reviews on component mount
  useEffect(() => {
    loadReviewsFromStorage();
    
    // Check owner status
    const savedOwnerStatus = localStorage.getItem('reviews_owner');
    if (savedOwnerStatus === 'true') {
      setIsOwner(true);
    }
  }, []);

  const loadReviewsFromStorage = async () => {
    try {
      setIsLoading(true);
      const loadedReviews = await reviewsService.loadReviews();
      setReviews(loadedReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Owner Login
  const handleOwnerLogin = () => {
    // CHANGE THIS PASSWORD to whatever you want!
    if (password === 'owner123') {
      setIsOwner(true);
      setShowLogin(false);
      setPassword('');
      localStorage.setItem('reviews_owner', 'true');
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  // Owner Logout
  const handleOwnerLogout = () => {
    setIsOwner(false);
    localStorage.removeItem('reviews_owner');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        verified: true,
        ownerReply: null,
        replyDate: null
      };

      const result = await reviewsService.addReview(reviewData);
      
      if (result.success) {
        // Update local state
        setReviews(prev => [result.review, ...prev]);
        
        // Reset form
        setFormData({
          name: '',
          service: '',
          rating: 5,
          review: '',
          location: ''
        });
        setShowReviewForm(false);
        
        alert('Thank you for your review! It\'s now visible to everyone.');
      }

    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete review (owner only)
  const deleteReview = async (reviewId, event) => {
    if (!isOwner) return;
    event.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewsService.deleteReview(reviewId);
        setReviews(prev => prev.filter(review => review.id !== reviewId));
      } catch (error) {
        alert('Failed to delete review: ' + error.message);
      }
    }
  };

  // Start replying to a review
  const startReply = (reviewId) => {
    setReplyingTo(reviewId);
    setReplyText('');
  };

  // Cancel reply
  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  // Submit owner reply
  const submitOwnerReply = async (reviewId) => {
    if (!replyText.trim()) {
      alert('Please enter a reply message');
      return;
    }

    try {
      const replyData = {
        ownerReply: replyText.trim(),
        replyDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      };

      // Update the review with owner reply
      await reviewsService.updateReview(reviewId, replyData);
      
      // Update local state
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, ...replyData } : review
      ));
      
      // Reset reply state
      cancelReply();
      
      alert('Reply posted successfully!');
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Failed to submit reply. Please try again.');
    }
  };

  // Delete owner reply
  const deleteOwnerReply = async (reviewId, event) => {
    if (!isOwner) return;
    event.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this reply?')) {
      try {
        const replyData = {
          ownerReply: null,
          replyDate: null
        };

        await reviewsService.updateReview(reviewId, replyData);
        
        // Update local state
        setReviews(prev => prev.map(review => 
          review.id === reviewId ? { ...review, ...replyData } : review
        ));
        
        alert('Reply deleted successfully!');
      } catch (error) {
        alert('Failed to delete reply: ' + error.message);
      }
    }
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  // Generate star rating display
  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <section className="reviews" id="reviews">
      {/* Animated Background Graphics */}
      <div className="animated-background">
        <div className="graphic graphic-1">⭐</div>
        <div className="graphic graphic-2">💬</div>
        <div className="graphic graphic-3">👑</div>
        <div className="graphic graphic-4">✏️</div>
        <div className="graphic graphic-5">📱</div>
        <div className="graphic graphic-6">🎨</div>
        <div className="graphic graphic-7">📸</div>
        <div className="graphic graphic-8">🎮</div>
        <div className="graphic graphic-9">🎵</div>
        <div className="graphic graphic-10">💫</div>
      </div>

      <div className="container">
        {/* Owner Access Controls */}
        <div className="owner-access-bar">
          {!isOwner ? (
            <div className="viewer-mode">
              <span className="viewer-badge">👀 Viewing Mode</span>
              <button 
                className="owner-login-btn"
                onClick={() => setShowLogin(true)}
              >
                🔧 Owner Login
              </button>
            </div>
          ) : (
            <div className="owner-mode">
              <div className="owner-status">
                <span className="owner-badge">👑 OWNER MODE</span>
                <span className="owner-info">You can manage reviews and reply to clients</span>
              </div>
              <div className="owner-actions">
                <button 
                  className="logout-btn"
                  onClick={handleOwnerLogout}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Login Modal */}
        {showLogin && (
          <div className="login-modal-overlay" onClick={() => setShowLogin(false)}>
            <div className="login-modal" onClick={(e) => e.stopPropagation()}>
              <div className="login-header">
                <h3>Owner Access</h3>
                <button 
                  className="close-login"
                  onClick={() => setShowLogin(false)}
                >
                  ×
                </button>
              </div>
              <div className="login-body">
                <p>Enter the owner password to manage reviews and reply to clients</p>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter owner password"
                  onKeyPress={(e) => e.key === 'Enter' && handleOwnerLogin()}
                  className="password-input"
                />
                <div className="login-actions">
                  <button 
                    className="login-confirm"
                    onClick={handleOwnerLogin}
                  >
                    🔑 Login as Owner
                  </button>
                  <button 
                    className="login-cancel"
                    onClick={() => setShowLogin(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="reviews-header">
          <h1>Client Reviews & Testimonials</h1>
          <p>See what our clients say about their experience working with us</p>
          
          <div className="reviews-stats">
            <div className="stat">
              <span className="stat-number">{reviews.length}</span>
              <span className="stat-label">Total Reviews</span>
            </div>
            <div className="stat">
              <span className="stat-number">{averageRating}</span>
              <span className="stat-label">Average Rating</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {reviews.filter(review => review.ownerReply).length}
              </span>
              <span className="stat-label">Owner Replies</span>
            </div>
          </div>
        </div>

        <div className="add-review-section">
          <button 
            className="add-review-btn"
            onClick={() => setShowReviewForm(true)}
          >
            ✍️ Write a Review
          </button>
          
        </div>

        {isLoading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading reviews...</p>
          </div>
        )}

        {!isLoading && (
          <div className="reviews-grid">
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.id} className="review-card">
                  {/* Delete Button - ONLY SHOWS FOR OWNER */}
                  {isOwner && (
                    <button 
                      className="delete-review-btn"
                      onClick={(e) => deleteReview(review.id, e)}
                      title="Delete this review"
                    >
                      ×
                    </button>
                  )}
                  
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="avatar">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="reviewer-details">
                        <h4>{review.name}</h4>
                        <span className="review-location">
                          {review.location}
                        </span>
                      </div>
                    </div>
                    <div className="review-meta">
                      <span className="review-date">{review.date}</span>
                      {review.verified && (
                        <span className="verified-badge">Verified</span>
                      )}
                    </div>
                  </div>

                  <div className="review-service">
                    <span className="service-tag">{review.service}</span>
                  </div>

                  <div className="review-rating">
                    <span className="stars">{getRatingStars(review.rating)}</span>
                    <span className="rating-text">{review.rating}/5</span>
                  </div>

                  <div className="review-content">
                    <p>"{review.review}"</p>
                  </div>

                  {/* Owner Reply Section */}
                  {review.ownerReply && (
                    <div className="owner-reply-section">
                      <div className="owner-reply-header">
                        <div className="owner-avatar">👑</div>
                        <div className="owner-info">
                          <strong>Business Owner</strong>
                          <span className="reply-date">{review.replyDate}</span>
                        </div>
                        {isOwner && (
                          <button 
                            className="delete-reply-btn"
                            onClick={(e) => deleteOwnerReply(review.id, e)}
                            title="Delete reply"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      <div className="owner-reply-content">
                        <p>{review.ownerReply}</p>
                      </div>
                    </div>
                  )}

                  {/* Owner Reply Button (Owner Only) */}
                  {isOwner && !review.ownerReply && (
                    <div className="reply-actions">
                      {replyingTo === review.id ? (
                        <div className="reply-form">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your response to the client..."
                            rows="3"
                            className="reply-textarea"
                          />
                          <div className="reply-buttons">
                            <button 
                              className="cancel-reply-btn"
                              onClick={cancelReply}
                            >
                              Cancel
                            </button>
                            <button 
                              className="submit-reply-btn"
                              onClick={() => submitOwnerReply(review.id)}
                            >
                              Post Reply
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          className="reply-btn"
                          onClick={() => startReply(review.id)}
                        >
                          💬 Reply as Owner
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-reviews">
                <div className="empty-icon">💬</div>
                <h3>No Reviews Yet</h3>
                <p>Be the first to share your experience! Your review will be visible to all clients.</p>
                <button 
                  className="add-review-btn"
                  onClick={() => setShowReviewForm(true)}
                >
                  Write First Review
                </button>
              </div>
            )}
          </div>
        )}

        {showReviewForm && (
          <div className="modal-overlay" onClick={() => setShowReviewForm(false)}>
            <div className="review-form-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Write a Review</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowReviewForm(false)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="review-form">
                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="service">Service Used *</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Photography">Photography</option>
                    <option value="Motion Picture">Motion Picture</option>
                    <option value="Gadgets & Electronics">Gadgets & Electronics</option>
                    <option value="Gaming Services">Gaming Services</option>
                    <option value="Music Artworks">Music Artworks</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="location">Your Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                  />
                </div>

                <div className="form-group">
                  <label>Your Rating *</label>
                  <div className="rating-selector">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className={`rating-star ${star <= formData.rating ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      >
                        {star <= formData.rating ? '★' : '☆'}
                      </button>
                    ))}
                    <span className="rating-text">{formData.rating}/5 Stars</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="review">Your Review *</label>
                  <textarea
                    id="review"
                    name="review"
                    value={formData.review}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    placeholder="Share your experience with our service..."
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .reviews {
          padding: 80px 0;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        /* Animated Background Graphics */
        .animated-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .graphic {
          position: absolute;
          font-size: 2rem;
          opacity: 0.1;
          animation: float 20s infinite linear;
          z-index: 0;
        }

        .graphic-1 {
          top: 10%;
          left: 5%;
          animation-delay: 0s;
          animation-duration: 25s;
        }

        .graphic-2 {
          top: 20%;
          right: 10%;
          animation-delay: 2s;
          animation-duration: 30s;
        }

        .graphic-3 {
          top: 60%;
          left: 8%;
          animation-delay: 4s;
          animation-duration: 35s;
        }

        .graphic-4 {
          top: 40%;
          right: 15%;
          animation-delay: 6s;
          animation-duration: 28s;
        }

        .graphic-5 {
          top: 80%;
          left: 20%;
          animation-delay: 8s;
          animation-duration: 32s;
        }

        .graphic-6 {
          top: 30%;
          left: 25%;
          animation-delay: 10s;
          animation-duration: 26s;
        }

        .graphic-7 {
          top: 70%;
          right: 25%;
          animation-delay: 12s;
          animation-duration: 34s;
        }

        .graphic-8 {
          top: 15%;
          left: 40%;
          animation-delay: 14s;
          animation-duration: 29s;
        }

        .graphic-9 {
          top: 55%;
          right: 5%;
          animation-delay: 16s;
          animation-duration: 31s;
        }

        .graphic-10 {
          top: 85%;
          right: 35%;
          animation-delay: 18s;
          animation-duration: 27s;
        }

        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-20px) rotate(90deg) scale(1.1);
          }
          50% {
            transform: translateY(0px) rotate(180deg) scale(1);
          }
          75% {
            transform: translateY(20px) rotate(270deg) scale(0.9);
          }
          100% {
            transform: translateY(0px) rotate(360deg) scale(1);
          }
        }

        /* Make sure content stays above background */
        .container {
          position: relative;
          z-index: 1;
        }

        .owner-access-bar {
          position: relative;
          z-index: 2;
        }

        .reviews-header,
        .add-review-section,
        .reviews-grid,
        .loading-state,
        .no-reviews {
          position: relative;
          z-index: 1;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Owner Access Bar */
        .owner-access-bar {
          background: linear-gradient(135deg, #8005fcff 0%, #6d0ffaff 100%);
          color: white;
          padding: 15px 25px;
          border-radius: 15px;
          margin-bottom: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .viewer-mode, .owner-mode {
          display: flex;
          align-items: center;
          gap: 20px;
          width: 100%;
          justify-content: space-between;
        }

        .owner-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .viewer-badge {
          background: rgba(255, 255, 255, 0.15);
          padding: 8px 16px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.9rem;
          backdrop-filter: blur(10px);
        }

        .owner-status {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .owner-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 25px;
          font-weight: bold;
          font-size: 0.85rem;
          backdrop-filter: blur(10px);
        }

        .owner-info {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .owner-login-btn, .logout-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .owner-login-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
        }

        .logout-btn {
          background: rgba(102, 7, 198, 0.8);
        }

        .logout-btn:hover {
          background: rgba(123, 38, 220, 0.9);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        /* Login Modal */
        .login-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(5px);
        }

        .login-modal {
          background: white;
          border-radius: 20px;
          max-width: 450px;
          width: 100%;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .login-header {
          background: linear-gradient(135deg, #9608c1ff 0%, #9605f7ff 100%);
          color: white;
          padding: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .login-header h3 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 700;
        }

        .close-login {
          background: none;
          border: none;
          color: white;
          font-size: 1.8rem;
          cursor: pointer;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
        }

        .close-login:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .login-body {
          padding: 35px;
        }

        .login-body p {
          color: #64748b;
          margin-bottom: 25px;
          text-align: center;
          font-size: 1.1rem;
          line-height: 1.5;
        }

        .password-input {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          margin-bottom: 25px;
          transition: all 0.3s ease;
          background: #f8fafc;
        }

        .password-input:focus {
          outline: none;
          border-color: #7a0ec8ff;
          background: white;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .login-actions {
          display: flex;
          gap: 12px;
        }

        .login-confirm {
          flex: 2;
          background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%);
          color: white;
          border: none;
          padding: 15px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .login-confirm:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
        }

        .login-cancel {
          flex: 1;
          background: #64748b;
          color: white;
          border: none;
          padding: 15px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .login-cancel:hover {
          background: #475569;
          transform: translateY(-2px);
        }

        .reviews-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .reviews-header h1 {
          font-size: 3rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .reviews-header p {
          font-size: 1.2rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto 40px;
          line-height: 1.6;
        }

        .reviews-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          max-width: 600px;
          margin: 0 auto;
        }

        .stat {
          background: white;
          padding: 30px 20px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
        }

        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          color: #ff6b35;
          margin-bottom: 8px;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .add-review-section {
          text-align: center;
          margin-bottom: 50px;
        }

        .add-review-btn {
          background: #640aa9ff;
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-review-btn:hover {
          background: #e55a2b;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
        }

        .shared-notice {
          color: #64748b;
          margin-top: 15px;
          font-size: 0.95rem;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #7509b3ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 30px;
          margin-bottom: 60px;
        }

        .review-card {
          background: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          transition: transform 0.3s ease;
          position: relative;
        }

        .review-card:hover {
          transform: translateY(-5px);
        }

        .delete-review-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(117, 4, 4, 0.9);
          color: white;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          opacity: 0;
        }

        .review-card:hover .delete-review-btn {
          opacity: 1;
        }

        .delete-review-btn:hover {
          background: rgba(146, 9, 9, 1);
          transform: scale(1.1);
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .reviewer-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 50px;
          height: 50px;
          background: #9907dcff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .reviewer-details h4 {
          margin: 0 0 4px 0;
          color: #1e293b;
          font-size: 1.1rem;
        }

        .review-location {
          color: #64748b;
          font-size: 0.9rem;
        }

        .review-meta {
          text-align: right;
        }

        .review-date {
          display: block;
          color: #94a3b8;
          font-size: 0.85rem;
          margin-bottom: 4px;
        }

        .verified-badge {
          background: #10b981;
          color: white;
          padding: 4px 8px;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .review-service {
          margin-bottom: 15px;
        }

        .service-tag {
          background: #9311a9ff;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .review-rating {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .stars {
          color: #0bb808ff;
          font-size: 1.3rem;
        }

        .rating-text {
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .review-content {
          color: #475569;
          line-height: 1.6;
          margin: 0;
          font-style: italic;
        }

        /* Owner Reply Section */
        .owner-reply-section {
          margin-top: 20px;
          padding: 20px;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 12px;
          border-left: 4px solid #7a0ec8ff;
          position: relative;
        }

        .owner-reply-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          position: relative;
        }

        .owner-avatar {
          width: 35px;
          height: 35px;
          background: #7a0ec8ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .owner-info {
          flex: 1;
        }

        .owner-info strong {
          color: #1e293b;
          display: block;
          margin-bottom: 2px;
        }

        .reply-date {
          color: #64748b;
          font-size: 0.8rem;
        }

        .delete-reply-btn {
          background: rgba(117, 4, 4, 0.7);
          color: white;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .delete-reply-btn:hover {
          background: rgba(146, 9, 9, 1);
          transform: scale(1.1);
        }

        .owner-reply-content {
          color: #374151;
          line-height: 1.5;
          margin: 0;
          font-style: normal;
        }

        /* Reply Actions */
        .reply-actions {
          margin-top: 20px;
        }

        .reply-btn {
          background: #7a0ec8ff;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .reply-btn:hover {
          background: #9605f7ff;
          transform: translateY(-2px);
        }

        .reply-form {
          margin-top: 15px;
        }

        .reply-textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          resize: vertical;
          min-height: 80px;
          margin-bottom: 12px;
        }

        .reply-textarea:focus {
          outline: none;
          border-color: #7a0ec8ff;
        }

        .reply-buttons {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .cancel-reply-btn {
          background: #64748b;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .cancel-reply-btn:hover {
          background: #475569;
        }

        .submit-reply-btn {
          background: #7a0ec8ff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .submit-reply-btn:hover:not(:disabled) {
          background: #9605f7ff;
        }

        .submit-reply-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .no-reviews {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .no-reviews h3 {
          color: #1e293b;
          margin-bottom: 12px;
          font-size: 1.5rem;
        }

        .no-reviews p {
          color: #64748b;
          margin-bottom: 30px;
          font-size: 1.1rem;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(5px);
        }

        .review-form-modal {
          background: white;
          border-radius: 20px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow: auto;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 30px 30px 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h3 {
          margin: 0;
          color: #1e293b;
          font-size: 1.5rem;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.8rem;
          color: #64748b;
          cursor: pointer;
          padding: 5px;
        }

        .close-btn:hover {
          color: #25a804ff;
        }

        .review-form {
          padding: 30px;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #374151;
          font-weight: 500;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #230ee2ff;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .rating-selector {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .rating-star {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #cbd5e1;
          transition: color 0.2s ease;
          padding: 5px;
        }

        .rating-star.selected {
          color: #b413c9ff;
        }

        .rating-text {
          margin-left: 12px;
          color: #64748b;
          font-weight: 500;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 30px;
        }

        .cancel-btn,
        .submit-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn {
          background: #64748b;
          color: white;
        }

        .cancel-btn:hover {
          background: #475569;
        }

        .submit-btn {
          background: #ce2ea8ff;
          color: white;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #e52ec0ff;
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @media (max-width: 768px) {
          .reviews-stats {
            grid-template-columns: 1fr;
          }

          .reviews-grid {
            grid-template-columns: 1fr;
          }

          .review-header {
            flex-direction: column;
            gap: 10px;
          }

          .review-meta {
            text-align: left;
          }

          .reviews-header h1 {
            font-size: 2.5rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .owner-mode {
            flex-direction: column;
            gap: 15px;
          }

          .owner-actions {
            flex-direction: column;
            width: 100%;
          }

          .owner-actions button {
            width: 100%;
          }

          /* Reduce graphics on mobile */
          .graphic {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Reviews;