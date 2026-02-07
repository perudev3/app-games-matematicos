import { defineStore } from 'pinia'
import { supabase } from 'boot/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: true
  }),

  actions: {
    async init () {
      const { data } = await supabase.auth.getSession()
      this.user = data.session?.user || null
      this.loading = false

      supabase.auth.onAuthStateChange((_event, session) => {
        this.user = session?.user || null
      })
    },

    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // 🔑 Actualizar user en el store para que el watch funcione
      this.user = data.user
    },

    async logout () {
      await supabase.auth.signOut()
      this.user = null
    },

    async register({ name, email, password }) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(), // 🔹 quitar espacios
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: '',
        }
      })

      if (error) throw error
      this.user = data.user
    }

  }
})
