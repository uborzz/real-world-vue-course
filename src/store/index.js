import Vue from 'vue'
import Vuex from 'vuex'
import EventService from '@/services/EventService.js'
import * as notification from '@/store/modules/notification.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    notification
  },
  state: {
    user: { id: 'abc123', name: 'Adam Jahr' },
    categories: [
      'sustainability',
      'nature',
      'animal welfare',
      'housing',
      'education',
      'food',
      'community'
    ],
    event: {},
    events: [],
    totalEvents: 0
  },
  mutations: {
    ADD_EVENT(state, event) {
      state.events.push(event)
    },
    SET_EVENTS(state, data) {
      state.events = data.events
      state.totalEvents = data.totalEvents
    },
    SET_EVENT(state, event) {
      state.event = event
    }
  },
  actions: {
    createEvent({ commit, dispatch }, event) {
      return EventService.postEvent(event)
        .then(() => {
          commit('ADD_EVENT', event)
          const notification = {
            type: 'success',
            message: 'Your event has been created!'
          }
          dispatch('notification/add', notification, { root: true })
        })
        .catch(error => {
          const notification = {
            type: 'error',
            message: 'There was a problem creating your event: ' + error.message
          }
          dispatch('notification/add', notification, { root: true })
          throw error
        })
    },
    fetchEvents({ commit, dispatch }, { perPage, page }) {
      EventService.getEvents(perPage, page)
        .then(response => {
          let totalEvents = parseInt(response.headers['x-total-count'])
          commit('SET_EVENTS', {
            events: response.data,
            totalEvents: totalEvents
          })
        })
        .catch(error => {
          const notification = {
            type: 'error',
            message: 'There was a problem fetching events: ' + error.message
          }
          dispatch('notification/add', notification, { root: true })
        })
    },
    fetchEvent({ commit, dispatch }, id) {
      var event = this.getters.getEventById(id) // already have it?
      if (event) {
        // if OK, then just update state.
        console.log('taken from cache')
        commit('SET_EVENT', event)
      } else {
        // else, go fetch,
        EventService.getEvent(id)
          .then(response => {
            commit('SET_EVENT', response.data)
          })
          .catch(error => {
            const notification = {
              type: 'error',
              message: 'There was a problem fetching an event: ' + error.message
            }
            dispatch('notification/add', notification, {
              root: true
            })
          })
      }
    }
  },
  getters: {
    getEventById: state => id => {
      return state.events.find(event => event.id === id)
    }
  }
})
