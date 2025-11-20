import { supabase } from './supabase';
export const logAction = async (actionType, description, targetId = null, targetType = null, metadata = {}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const logData = {
      user_id: user?.id || null,
      user_email: user?.email || 'guest',
      action_type: actionType,
      description: description,
      target_id: targetId,
      target_type: targetType,
      metadata: metadata,
      user_agent: navigator.userAgent,
      ip_address: 'client'
    };

    const { error } = await supabase
      .from('system_logs')
      .insert(logData);

    if (error) {
      console.error('Erro ao salvar log:', error);
    }
  } catch (error) {
    console.error('Erro no logger:', error);
  }
};

export const LogActions = {
  USER_LOGIN: 'user_login',
  USER_REGISTER: 'user_register', 
  USER_LOGOUT: 'user_logout',
  ADD_PRODUCT: 'add_product',
  UPDATE_PRODUCT: 'update_product',
  DELETE_PRODUCT: 'delete_product',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  COMPLETE_PURCHASE: 'complete_purchase',
  USER_PROFILE_UPDATE: 'user_profile_update'
};