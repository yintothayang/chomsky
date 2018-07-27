import API from '../api'
import uuid from 'uuid/v4'

// State
const state = {
  cards: [],
  selectedCards: [],
  filteredCards: [],
}

// Getters
var getters = {
  cards: state => state.cards,
  selectedCards: state => state.selectedCards,
  selectedDeckCards: (state, getters, rootState) => {
    let selectedDecks = rootState.decks.selectedDecks
    if(selectedDecks.length){
      let card_ids = []
      selectedDecks.forEach(deck => {
        card_ids = card_ids.concat(deck.card_ids)
      })
      return state.cards.filter(card => card_ids.includes(card.id))
    } else {
      return []
    }
  },
  filteredCards: (state, getters, rootState) => {
    if(rootState.navbar.filter){
      let filter = rootState.navbar.filter.toLowerCase()
      return state.cards.filter(card => {
        if(card.front.toLowerCase().includes(filter) ||
           card.back.toLowerCase().includes(filter)){
          return true
        } else {
          return false
        }
      })
    } else {
      return state.cards
    }
  }
}

// Mutations
var mutations = {
  ["SET_CARDS"] (state, cards) {
    state.cards = cards
  },
  ["ADD_CARD"] (state, card) {
    card.id = uuid()
    state.cards.push(card)
  },
  ["TOGGLE_SELECTED"] (state, card) {
    let i = state.selectedCards.indexOf(card)
    if(i > -1){
      state.selectedCards.splice(i, 1)
    } else {
      state.selectedCards.push(card)
    }
  },
  ["SET_SELECTED"] (state, cards=[]) {
    state.selectedCards = cards
  },
  ["UPDATE_CARD"] (state, {card, updates}) {
    Object.assign(card, updates)
  },
  ["LOAD_CARDS"] (state, card) {
    let local_cards = localStorage.getItem('cards')
    state.cards = !!local_cards ? JSON.parse(local_cards) : []
  },
  ["SAVE_CARDS"] (state, card) {
    localStorage.setItem('cards', JSON.stringify(state.cards))
  },
}

// Actions
var actions = {
  fetchCards: ({commit}, data = {}) => {
    return API.cards.fetch(data).then(results => {
      commit("SET_CARDS", results.body)
      return results.body
    })
  },
  addCard: ({commit}, data = {}) => {
    return API.cards.add(data).then(results => {
      commit("ADD_CARD", results.body)
      return results.body
    })
  },
  removeCard: ({commit}, data = {}) => {
    return API.cards.remove(data).then(results => {
      commit("REMOVE_CARD", results.body)
      return results.body
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}