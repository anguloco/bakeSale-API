import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  PanResponder, 
  Animated, 
  Dimensions,
  Button,
  Linking,
  ScrollView
 } from 'react-native';
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import ajax from '../ajax';

import { priceDisplay } from '../util'

const DealDetail = ({ initialDealData, onBack }) => {
  const [deal, setDeal] = useState(initialDealData)
  const [imageIndex, setImageIndex] = useState(0)
  const [indexDirection, setIndexDirection] = useState(1)

  const imageXPos = new Animated.Value(0)

  const width = Dimensions.get('window').width 

  const imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gs) => {
      imageXPos.setValue(gs.dx)
    },
    onPanResponderRelease: (evt, gs) => {
      if (Math.abs(gs.dx) > width * 0.4) {
        const direction = Math.sign(gs.dx)

        Animated.timing(imageXPos, {
          toValue: direction * width,
          duration: 250,
        }).start(() => handleSwipe())
        
        setIndexDirection(-1 * direction)
      } else {
        Animated.spring(imageXPos, {
          toValue: 0,
        }).start()
      }
    },
  })

  const openDealUrl = () => {
    Linking.openURL(deal.url)
  }

  const handleSwipe = () => {
    if (!deal.media[imageIndex + indexDirection]) {

      Animated.spring(imageXPos, {
        toValue: 0,
      }).start()

      return 
    }
    setImageIndex(imageIndex + indexDirection)
  } 

  useEffect(() => {
    imageXPos.setValue(indexDirection * width)

    Animated.spring(imageXPos, {
      toValue: 0,
    }).start()
  }, [imageIndex])

  useEffect(() => {
    ajax.fetchDealDetail(deal.key).then(fullDeal => {
      setDeal(fullDeal)
    })
  }, [])

  return (
    <ScrollView style={styles.deal}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.backLink}>Back</Text>
      </TouchableOpacity>

      <Animated.Image 
        {...imagePanResponder.panHandlers}
        source={{ uri: deal.media[imageIndex] }} 
        style={[{left: imageXPos}, styles.image]}
      />

      <View style={styles.detail}>
        <View>
          <Text style={styles.title}>{deal.title}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.info}>
            <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
            <Text style={styles.cause}>{deal.cause.name}</Text>
          </View>
        
          {deal.user && (
            <View style={styles.user}>
              <Image source={{ uri: deal.user.avatar }} style={styles.avatar} />
              <Text>{deal.user.name}</Text>
            </View>
          )}
        
        </View>
      </View>

      <View style={styles.description}>
        <Text>{deal.description}</Text>
      </View>

      <Button title="But this deal!" onPress={openDealUrl} />

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  detail: {
    borderColor: '#bbb',
    borderWidth: 1,
  },

  backLink: {
    marginBottom: 5,
    color: '#22f',
    marginLeft: 10,
  },
  
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc'
  },

  info: {
    padding: 10,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 16,
    padding: 10,
    fontWeight: 'bold',
    backgroundColor: 'rgba(237, 149, 45, 0.4)',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
  },

  info: {
    alignContent: 'center',
  },

  user: {
    alignItems: 'center',
  },

  cause: {
    marginVertical: 10,
  },

  price: {
    fontWeight: 'bold',
  },

  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },

  description: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderStyle: 'dotted',
    margin: 10,
    padding: 10,
  },

  deal: {
    marginBottom: 20,
  }
})

DealDetail.prototypes = {
  initialDealData: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
}

export default DealDetail