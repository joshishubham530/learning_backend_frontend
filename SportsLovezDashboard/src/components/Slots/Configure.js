import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  RefreshControl,
  StyleSheet,
  FlatList,
  TouchableNativeFeedback,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import styles from '../../utilities/stylesheet';
import PreLoader from '../../utilities/PreLoader';
import {CFetch} from '../../settings/APIFetch';
import {UserContext, AuthContext} from '../../settings/Context';
import {Dimensions} from 'react-native';
import {WaitModal} from '../../utilities/PreLoader';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import {Picker} from '@react-native-picker/picker';
import PickerModal from '../../utilities/PickerModal';
import SlotsList from './SlotsList';
import Colors from '../../settings/Colors';

const width = Dimensions.get('window').width;
const Configure = ({route}) => {
  const navigation = useNavigation();
  const {signOut} = useContext(AuthContext);
  const {token, userName} = useContext(UserContext);
  const [items, setItems] = useState({
    isEditing: false,
    isReadOnly: false,
    isLoaded: false,
    isInternet: true,
    isError: false,
    isClicked: false,
  });
  const [response, setResponse] = useState([]);
  const [isAllLoaded, setIsAllLoaded] = useState(false);
  const [skip, setSkip] = useState(0);
  const [visible, setVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState('');
  const [selectedRangeName, setSelectedRangeName] = useState('');
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [filter, setFilter] = useState('Future');

  var w = Dimensions.get('window').width;
  var h = Dimensions.get('window').height;

  const loadData = () => {
    CFetch('/Management/ConfigureList?id=' + route.params.id, token, {})
      .then(res => {
        if (res.status == 200) {
          res.json().then(result => {
            setResponse(result);
            if (result.length > 0) {
              var item = result.filter(g => g.selected);
              if (item.length > 0) {
                setSelectedRange(item[0].timeStamp);
                setSelectedRangeName(item[0].name);
              }
            }
          });
          setSkip(10);
        } else {
          setItems({...items, isError: true, isLoaded: true, isInternet: true});
          Toast.show('Something went wrong', Toast.SHORT);
        }
      })
      .catch(error => {
        setItems({
          ...items,
          isInternet: false,
          isLoaded: true,
          isError: false,
        });
        Toast.show('No Internet Connection', Toast.SHORT);
      })
      .finally(() => {
        setTimeout(() => {
          setItems({
            ...items,
            isEditing: false,
            isReadOnly: false,
            isLoaded: true,
            isInternet: true,
            isError: false,
          });
        }, 1);
      });
  };
  // useFocusEffect(
  //   useCallback(() => {
  //     if (route.params.timeStamp) {
  //       setSelectedRange(route.params.timeStamp)
  //     }
  //     if (route.params.rangeName) {
  //       setSelectedRangeName(route.params.rangeName)
  //     }
  //     setItems({
  //       ...items,
  //       isClicked: true,
  //       isLoaded: true,
  //     });
  //     loadData();
  //     return () => false;
  //   }, []),
  // );
  useEffect(() => {
    loadData();
  }, []);
  const loadMore = () => {
    CFetch(
      '/Management/ConfigureList?id=' + route.params.id + '&skip=' + skip,
      token,
      {},
    )
      .then(res => {
        if (res.status == 200) {
          res.json().then(result => {
            if (result.length != 0) {
              setResponse([...response, ...result]);
              setSkip(skip + 10);
            } else {
              setIsAllLoaded(true);
            }
          });
        }
      })
      .catch(error => {
        setItems({
          ...items,
          isInternet: false,
        });
        Toast.show('No Internet Connection.', Toast.SHORT);
      });
  };
  const onSelectRange = val => {
    setSelectedRange(val);
    var model = response.filter(g => g.timeStamp === val);
    if (model.length > 0) {
      setSelectedRangeName(model[0].name);
    }
  };

  return (
    <>
      {items.isLoaded ? <WaitModal modalVisible={items.isClicked} /> : null}
      {!items.isLoaded && items.isInternet ? (
        <PreLoader />
      ) : !items.isInternet ? (
        <View
          style={[
            styles.container,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <Text style={{marginBottom: 10}}>No Internet Connection</Text>
          <Button
            title="Retry"
            color={Colors.blue}
            onPress={() =>
              setItems({...items, isLoaded: false, isInternet: true})
            }
          />
        </View>
      ) : items.isInternet && items.isError == true ? (
        <View
          style={[
            styles.container,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <Text style={{marginBottom: 10}}>Something went wrong.</Text>
          <Button
            title="Retry"
            color={Colors.blue}
            onPress={() => {
              setItems({
                ...items,
                isLoaded: false,
                isInternet: true,
                isError: false,
              }),
                loadData();
            }}
          />
        </View>
      ) : (
        <View style={styles.container}>
          {response.length > 0 ? (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '90%',
                  justifyContent: 'space-between',
                  marginHorizontal: 10,
                }}>
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      width: '85%',
                      borderWidth: 1,
                      margin: 5,
                      borderRadius: 5,
                    }}
                    onPress={() => setVisible(true)}>
                    <Text style={{paddingHorizontal: 15, fontWeight: 'bold'}}>
                      {selectedRangeName}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    style={{width: '90%'}}
                    onValueChange={val => onSelectRange(val)}
                    selectedValue={selectedRange}>
                    {response.map((item, index) => (
                      <Picker.Item
                        key={index}
                        label={
                          item.name
                          // + " " + new Date(item.startTime).toDateString() + " - " + new Date(item.endTime).toDateString()
                        }
                        value={item.timeStamp}
                      />
                    ))}
                  </Picker>
                )}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('UpdateConfigureSlot1', {
                      id: route.params.id,
                      timeStamp: selectedRange,
                      facilityName: route.params.name,
                    })
                  }>
                  <Icon name="pencil-alt" color="green" />
                </TouchableOpacity>
              </View>
              <PickerModal
                visible={visible}
                setVisible={setVisible}
                Component={() => {
                  return (
                    <Picker
                      mode="dialog"
                      selectedValue={selectedRange}
                      onValueChange={val => onSelectRange(val)}
                      dropdownIconColor="white"
                      dropdownIconRippleColor="white">
                      {response.map((item, index) => (
                        <Picker.Item
                          key={index}
                          label={item.name}
                          value={item.timeStamp}
                        />
                      ))}
                    </Picker>
                  );
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '95%',
                  justifyContent: 'space-between',
                  marginHorizontal: 10,
                }}>
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      width: '85%',
                      borderWidth: 1,
                      margin: 5,
                      borderRadius: 5,
                    }}
                    onPress={() => setVisibleFilter(true)}>
                    <Text style={{paddingHorizontal: 15, fontWeight: 'bold'}}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    style={{width: '100%'}}
                    onValueChange={val => setFilter(val)}
                    selectedValue={filter}>
                    <Picker.Item key={0} label={'Future'} value={'Future'} />
                    <Picker.Item key={1} label={'Past'} value={'Past'} />
                  </Picker>
                )}
              </View>
              <PickerModal
                visible={visibleFilter}
                setVisible={setVisibleFilter}
                Component={() => {
                  return (
                    <Picker
                      mode="dialog"
                      selectedValue={filter}
                      onValueChange={val => setFilter(val)}
                      dropdownIconColor="white"
                      dropdownIconRippleColor="white">
                      <Picker.Item label={'Future'} value={'Future'} />
                      <Picker.Item label={'Past'} value={'Past'} />
                    </Picker>
                  );
                }}
              />
            </>
          ) : (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: Colors.red}}>No Slot Configration</Text>
            </View>
          )}
          {selectedRange ? (
            <SlotsList
              id={route.params.id}
              name={selectedRangeName}
              filter={filter}
              facilityName={route.params.name}
              timeStamp={selectedRange}
            />
          ) : null}
          {/* {response.length ? ( */}
          <View
            style={{
              flexDirection: 'row',
              width: w,
              bottom: 0,
              position: 'absolute',
            }}>
            <View style={{width: '50%', backgroundColor: Colors.red}}>
              <Button
                title="Back"
                color={Platform.OS === 'ios' ? 'white' : Colors.red}
                onPress={() => navigation.navigate('Home')}
              />
            </View>
            <View style={{width: '50%', backgroundColor: Colors.blue}}>
              <Button
                title="Add Another Range"
                color={Platform.OS === 'ios' ? 'white' : Colors.blue}
                onPress={() =>
                  navigation.navigate('ConfigureSlot1', {
                    id: route.params.id,
                    name: route.params.name,
                  })
                }
              />
            </View>
          </View>
          {/* ) : null} */}
        </View>
      )}
    </>
  );
};

export default Configure;

const mstyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
