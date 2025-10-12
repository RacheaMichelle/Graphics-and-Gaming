import { supabase } from '../supabase'

const useReviewsService = () => {
  const saveReviews = async (reviews) => {
    try {
      localStorage.setItem('portfolio_reviews_storage', JSON.stringify(reviews));
      return { success: true, message: 'Reviews saved successfully' };
    } catch (error) {
      throw new Error('Failed to save reviews: ' + error.message);
    }
  };
  
  const loadReviews = async () => {
    try {
      console.log('Loading reviews from Supabase...');
      
      const { data: supabaseReviews, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase reviews load error:', error);
        // Fallback to localStorage
        const localData = localStorage.getItem('portfolio_reviews_storage');
        return localData ? JSON.parse(localData) : [];
      }

      console.log('Loaded reviews from Supabase:', supabaseReviews);

      if (supabaseReviews && supabaseReviews.length > 0) {
        const reviews = supabaseReviews.map(review => ({
          id: review.id,
          name: review.name,
          service: review.service,
          rating: review.rating,
          review: review.review,
          location: review.location,
          verified: review.verified,
          ownerReply: review.owner_reply,
          replyDate: review.reply_date,
          date: new Date(review.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          timestamp: new Date(review.created_at).getTime()
        }));

        // Also save to localStorage for backup
        localStorage.setItem('portfolio_reviews_storage', JSON.stringify(reviews));
        return reviews;
      }

      // Fallback to localStorage if no Supabase data
      const localData = localStorage.getItem('portfolio_reviews_storage');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error('Reviews load error:', error);
      const localData = localStorage.getItem('portfolio_reviews_storage');
      return localData ? JSON.parse(localData) : [];
    }
  };
  
  const addReview = async (reviewData) => {
    try {
      console.log('Adding review:', reviewData);
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            name: reviewData.name,
            service: reviewData.service,
            rating: reviewData.rating,
            review: reviewData.review,
            location: reviewData.location,
            verified: reviewData.verified,
            owner_reply: reviewData.ownerReply,
            reply_date: reviewData.replyDate
          }
        ])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Review saved to Supabase:', data);

      // Check if data is returned properly
      if (!data || data.length === 0) {
        throw new Error('No data returned from Supabase');
      }

      const newReview = {
        id: data[0].id,
        ...reviewData,
        timestamp: new Date(data[0].created_at).getTime()
      };

      // Update local storage
      const reviews = await loadReviews();
      const updatedReviews = [newReview, ...reviews];
      await saveReviews(updatedReviews);

      return { success: true, review: newReview };
    } catch (error) {
      console.error('Add review error:', error);
      throw new Error('Failed to add review: ' + error.message);
    }
  };
  
  const deleteReview = async (reviewId) => {
    try {
      console.log('Deleting review:', reviewId);
      
      // Delete from Supabase
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      // Update local storage
      const reviews = await loadReviews();
      const updatedReviews = reviews.filter(review => review.id !== reviewId);
      await saveReviews(updatedReviews);

      return { success: true, message: 'Review deleted successfully' };
    } catch (error) {
      console.error('Delete review error:', error);
      throw new Error('Failed to delete review: ' + error.message);
    }
  };

  // Update review (for owner replies)
  const updateReview = async (reviewId, updateData) => {
    try {
      console.log('Updating review:', reviewId, updateData);
      
      const { data, error } = await supabase
        .from('reviews')
        .update({
          owner_reply: updateData.ownerReply,
          reply_date: updateData.replyDate
        })
        .eq('id', reviewId)
        .select();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Review updated in Supabase:', data);

      // Update local storage
      const reviews = await loadReviews();
      const updatedReviews = reviews.map(review => 
        review.id === reviewId 
          ? { ...review, ...updateData }
          : review
      );
      await saveReviews(updatedReviews);

      return { success: true, review: data[0] };
    } catch (error) {
      console.error('Update review error:', error);
      throw new Error('Failed to update review: ' + error.message);
    }
  };

  // Load replies for a review
  const loadReplies = async (reviewId) => {
    try {
      const { data: replies, error } = await supabase
        .from('replies')
        .select('*')
        .eq('review_id', reviewId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Supabase replies load error:', error);
        return [];
      }

      return replies || [];
    } catch (error) {
      console.error('Replies load error:', error);
      return [];
    }
  };

  // Add a reply
  const addReply = async (replyData) => {
    try {
      const { data, error } = await supabase
        .from('replies')
        .insert([
          {
            content: replyData.content,
            author_name: replyData.authorName,
            review_id: replyData.reviewId,
            parent_reply_id: replyData.parentReplyId,
            is_owner_reply: replyData.isOwnerReply || false
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase reply insert error:', error);
        throw error;
      }

      return { success: true, reply: data };
    } catch (error) {
      console.error('Add reply error:', error);
      throw new Error('Failed to add reply: ' + error.message);
    }
  };

  // Delete a reply
  const deleteReply = async (replyId) => {
    try {
      const { error } = await supabase
        .from('replies')
        .delete()
        .eq('id', replyId);

      if (error) {
        console.error('Supabase reply delete error:', error);
        throw error;
      }

      return { success: true, message: 'Reply deleted successfully' };
    } catch (error) {
      console.error('Delete reply error:', error);
      throw new Error('Failed to delete reply: ' + error.message);
    }
  };

  return { 
    saveReviews, 
    loadReviews, 
    addReview, 
    deleteReview,
    updateReview,
    loadReplies,
    addReply,
    deleteReply
  };
};

export default useReviewsService;