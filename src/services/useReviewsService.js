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
      // Try Supabase first
      const { data: supabaseReviews, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

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

        localStorage.setItem('portfolio_reviews_storage', JSON.stringify(reviews));
        return reviews;
      }

      // Fallback to localStorage
      const localData = localStorage.getItem('portfolio_reviews_storage');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error('Supabase reviews load error:', error);
      const localData = localStorage.getItem('portfolio_reviews_storage');
      return localData ? JSON.parse(localData) : [];
    }
  };
  
  const addReview = async (reviewData) => {
    try {
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
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;

      const newReview = {
        id: data[0].id,
        ...reviewData,
        timestamp: Date.now()
      };

      // Update local storage
      const reviews = await loadReviews();
      const updatedReviews = [newReview, ...reviews];
      await saveReviews(updatedReviews);

      return { success: true, review: newReview };
    } catch (error) {
      throw new Error('Failed to add review: ' + error.message);
    }
  };
  
  const deleteReview = async (reviewId) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      // Update local storage
      const reviews = await loadReviews();
      const updatedReviews = reviews.filter(review => review.id !== reviewId);
      await saveReviews(updatedReviews);

      return { success: true, message: 'Review deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete review: ' + error.message);
    }
  };
  
  return { saveReviews, loadReviews, addReview, deleteReview };
};

export default useReviewsService;