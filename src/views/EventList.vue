<template>
  <div>
    <h1>Events Listing</h1>
    <router-link :to="{ name: 'event-show', params: { id: 1 } }"
      >Show Event #1</router-link
    >
    -
    <router-link :to="{ name: 'event-show', params: { id: 2 } }"
      >Show Event #1</router-link
    >
    -
    <router-link :to="{ name: 'event-show', params: { id: 3 } }"
      >Show Event #1</router-link
    >
    -
  </div>
</template>
