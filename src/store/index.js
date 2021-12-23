import { createStore } from 'vuex';
import { auth, usersCollection } from '@/includes/firebase';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false
  },
  mutations: {
    toggleAuthModal: state => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth: state => {
      state.userLoggedIn = !state.userLoggedIn;
    }
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
  },
  actions: {
    register: async ({ commit }, { name, email, password, age, country }) => {
      const userCred = await auth.createUserWithEmailAndPassword(email, password);

      await usersCollection.doc(userCred.user.uid).set({
        name,
        email,
        age,
        country
      });

      await userCred.user.updateProfile({
        displayName: name
      });

      commit('toggleAuth');
    },
    async login({ commit }, { email, password }) {
      await auth.signInWithEmailAndPassword(email, password);

      commit('toggleAuth');
    },
    async signout({ commit }) {
      await auth.signOut();

      commit('toggleAuth');
    },
    initLogin({ commit }) {
      const user = auth.currentUser;

      if (user) {
        commit('toggleAuth');
      }
    }
  }
});
