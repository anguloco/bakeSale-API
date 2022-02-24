import React from 'react';
import { StyleSheet, Text, View, Easing, Dimensions, Animated } from 'react-native';
import { useEffect, useState } from 'react'
import ajax from './src/ajax'
import DealList from './src/components/DealList'
import DealDetail from './src/components/DealDetail';
import SearchBar from './src/components/SearchBar';

export default function App() {
  const [deals, setDeals] = useState([])
  const [activeSearchTerm, setActiveSerachTerm] = useState("")
  const [currentDealId, setCurrentDealId] = useState(null)
  const [dealsFromSearch, setDealsFromSearch] = useState([])
  const dealsToDisplay = dealsFromSearch.length > 0 ? dealsFromSearch : deals

  const titleXPos = new Animated.Value(0)

  const searchDeals = (searchTerm = []) => {
    if (searchTerm) {
      ajax.fetchDealsSearchResults(searchTerm).then(searchResults => {
        setDealsFromSearch(searchResults)
        setActiveSerachTerm(searchTerm)
      })
    } else {
      setDealsFromSearch(searchTerm)
    }
  }

  const currentDeal = () => {
    return deals.find(deal => deal.key === currentDealId )
  }

  const setCurrentDeal = (deal) => {
    setCurrentDealId(deal)
  }

  const unsetCurrentDeal = () => {
    setCurrentDealId(null)
  }

  const animateTitle = (direction = 1) => {
    const width = Dimensions.get('window').width - 150

    Animated.timing(
      titleXPos, { 
        toValue: direction * (width / 2), 
        duration: 1000,
        useNativeDriver: false,
        easing: Easing.ease,
      }
    ).start(({ finished }) => {
      if (finished) {
        animateTitle(-1 * direction)
      }
    })
  }

  useEffect(() => {
    animateTitle()
    ajax.fetchInitialDeals().then(fetchedDeals => {
      setDeals(fetchedDeals)
    })
  }, [])
  
  if (currentDealId) {
    return (
      <View style={styles.main}>
        <DealDetail 
          initialDealData={currentDeal()} 
          onBack={unsetCurrentDeal}
        />  
      </View>
    )
  } 

  if (dealsToDisplay.length > 0) {
    return (
      <View style={styles.main}>
        <SearchBar searchDeals={searchDeals} initialSearchTerm={activeSearchTerm} />
        <DealList deals={dealsToDisplay} onItemPress={setCurrentDeal} />
      </View>
    ) 
  }

  return (
    <Animated.View style={[{ left: titleXPos }, styles.container]}>
      <Text style={styles.header}>Bakesale!</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    fontSize: 40
  },

  main: {
    marginTop: 30,
  },
});
