import { supabase } from './supabase';
export const cartService = {
  supabase,
  
  async addToCart(productId, quantity = 1) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    console.log('➕ Adicionando ao carrinho - User:', user.id, 'Product:', productId);

    const { data: existingItem, error: checkError } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Erro ao verificar item existente:', checkError);
      throw checkError;
    }

    if (existingItem) {
      const { data, error } = await supabase
        .from('cart')
        .update({ 
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao atualizar quantidade:', error);
        throw error;
      }

      console.log('✅ Quantidade atualizada:', data);
      return { data, error: null };
    } else {
      const { data, error } = await supabase
        .from('cart')
        .insert([
          {
            user_id: user.id,
            product_id: productId,
            quantity: quantity,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao adicionar item:', error);
        throw error;
      }

      console.log('✅ Item adicionado:', data);
      return { data, error: null };
    }
  },

  async removeFromCart(cartItemId) {
    console.log('🗑️ Removendo item do carrinho:', cartItemId);
    
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', cartItemId);

    if (error) {
      console.error('❌ Erro ao remover item:', error);
      throw error;
    }

    console.log('✅ Item removido com sucesso');
    return { error: null };
  },

  async updateQuantity(cartItemId, quantity) {
    if (quantity <= 0) {
      return this.removeFromCart(cartItemId);
    }

    console.log('📊 Atualizando quantidade do item:', cartItemId, 'para', quantity);

    const { data, error } = await supabase
      .from('cart')
      .update({ 
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', cartItemId)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao atualizar quantidade:', error);
      throw error;
    }

    console.log('✅ Quantidade atualizada:', data);
    return { data, error: null };
  },

  async getCart() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('👤 Usuário não logado, retornando carrinho vazio');
      return { data: [], error: null };
    }

    console.log('🔄 Buscando carrinho para usuário:', user.id);

    const { data, error } = await supabase
      .from('cart')
      .select(`
        *,
        product_2v:product_id (
          id,
          title,
          description,
          price,
          thumbnail
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro ao buscar carrinho:', error);
      throw error;
    }

    console.log('✅ Carrinho encontrado:', data?.length || 0, 'itens');
    return { data, error: null };
  },

  async clearCart() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('👤 Usuário não logado, nada para limpar');
      return { error: null };
    }

    console.log('🧹 Limpando carrinho do usuário:', user.id);

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('❌ Erro ao limpar carrinho:', error);
      throw error;
    }

    console.log('✅ Carrinho limpo com sucesso');
    return { error: null };
  },

  async getCartCount() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return 0;
    }

    const { count, error } = await supabase
      .from('cart')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (error) {
      console.error('❌ Erro ao buscar contagem do carrinho:', error);
      return 0;
    }

    console.log('🔢 Contagem do carrinho:', count);
    return count || 0;
  }
};