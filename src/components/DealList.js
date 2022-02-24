import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import PropTypes from 'prop-types'
import DealItem from './DealItem';

const DealList = ({ deals, onItemPress }) => {
  return (
    <View style={styles.list}>
      <FlatList 
        data={deals}
        renderItem={({item}) => <DealItem 
        deal={item} onPress={onItemPress}/> }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#eee',
    flex: 1,
    width: '100%',
  },
})

DealList.prototypes = {
  deals: PropTypes.array.isRequired,
  onItemPress: PropTypes.func.isRequired,
}

export default DealList