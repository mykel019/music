import { defineStore } from "pinia";
import { ref } from "vue";
import { auth, userCollection } from '@/includes/firebase'


export default defineStore('user', () => {
  const userLoggedIn = ref(false)

  const authenticate = async(values) => {
    await auth.signInWithEmailAndPassword(values.email, values.password)
    userLoggedIn.value = true
  }

  const register = async(values) => {
    const userCred = await auth.createUserWithEmailAndPassword(values.email, values.password);

    await userCollection.doc(userCred.user.uid).set({
      name: values.name,
      email: values.email,
      age: values.age,
      country: values.country
    });

    await userCred.user.updateProfile({
      displayName: values.name
    })

    userLoggedIn.value = true
  }

  const signout = async() => {
    await auth.signOut();
    userLoggedIn.value = false
  }

  return {
    userLoggedIn,
    authenticate,
    register,
    signout
  }
})