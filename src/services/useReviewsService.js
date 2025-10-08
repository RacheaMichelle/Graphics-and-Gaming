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
            verified: reviewData.verified
          }
        ])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Review saved to Supabase:', data);

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
  
  return { saveReviews, loadReviews, addReview, deleteReview };
};

export default useReviewsService;
