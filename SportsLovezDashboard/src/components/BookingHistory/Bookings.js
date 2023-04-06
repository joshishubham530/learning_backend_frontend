import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import PreLoader, { WaitModal } from '../../utilities/PreLoader';
import styles from '../../utilities/stylesheet';
import { CFetch } from '../../settings/APIFetch';
import { AuthContext, UserContext } from '../../settings/Context';
import FlatlistFooter from '../../utilities/FlatListFooter';
import NoInternet from '../../utilities/NoInternet';
import { TextInput } from 'react-native';
import SelectButton from '../../utilities/SelectButton';
import Colors from '../../settings/Colors';
import DateTimePicker from '@react-native-community/datetimepicker'
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import DatePicker from 'react-native-date-picker';
const Bookings = ({ navigation }) => {
  const { token, userName } = useContext(UserContext);
  const { signOut } = useContext(AuthContext);
  const [items, setItems] = useState({
    isEditing: false,
    isReadOnly: false,
    isLoaded: false,
    isClicked: false,
    isInternet: true,
  });
  const [isAllLoaded, setIsAllLoaded] = useState(false);
  const [isInternet, setIsInternet] = useState(true);
  const [isError, setIsError] = useState(false);
  const [response, setResponse] = useState([]);
  const [allResponse, setAllResponse] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState('Upcoming');
  const [filterDate, setFilterDate] = useState('');
  const filers = ['Upcoming', 'Completed', 'Cancelled'];
  const [skip, setSkip] = useState(0);
  const onRefresh = useCallback(() => {
    setItems({ ...items, isLoaded: false });
    setSearchValue('');
    setResponse([]);
    setFilter('Upcoming');
    loadData('Upcoming');
  }, []);
  const loadMore = filterVal => {
    CFetch('/Management/BookingHistory?skip=' + skip + '&filter=' + filterVal, token, {})
      .then(res => {
        if (res.status == 200) {
          res.json().then(result => {
            if (result.length != 0) {
              if (filterDate && searchValue) {
                var filterArray = result.filter(g =>
                  new Date(g.bookingDate).toDateString() === new Date(filterDate).toDateString())
                setResponse([
                  ...response,
                  ...filterArray.filter(g =>
                    g.facilityName
                      .toLowerCase()
                      .match(
                        searchValue.toLowerCase() ||
                        g.name.toLowerCase().match(searchValue.toLowerCase()),
                      ),
                  ),
                ]);
              } else if (filterDate) {
                var filterArray = result.filter(g =>
                  new Date(g.bookingDate).toDateString() === new Date(filterDate).toDateString())
                setResponse([...response, ...filterArray])
              }
              else if (searchValue) {
                setResponse([
                  ...response,
                  ...result.filter(g =>
                    g.facilityName
                      .toLowerCase()
                      .match(
                        searchValue.toLowerCase() ||
                        g.name.toLowerCase().match(searchValue.toLowerCase()),
                      ),
                  ),
                ]);
              } else {
                setResponse([...response, ...result]);
              }
              setAllResponse([...allResponse, ...result]);
              setSkip(skip + 10);
            } else {
              setIsAllLoaded(true);
            }
          });
        } else if (res.status == 403) {
          signOut();
        }
      })
      .catch(error => {
        setItems({
          ...items,
          isInternet: false,
        });
        setIsInternet(false);
        Toast.show('No Internet Connection.', Toast.SHORT);
      });
  };
  const loadData = (filterVal) => {
    setIsAllLoaded(false);
    CFetch('/Management/BookingHistory?filter=' + filterVal, token, {})
      .then(res => {
        if (res.status == 200) {
          res.json().then(result => {
            setResponse(result);
            setAllResponse(result);
            setSkip(skip + 10);
          });
        }
      })
      .catch(error => {
        setItems({
          ...items,
          isInternet: false,
        });
        setIsInternet(false);
        Toast.show('No Internet Connection.', Toast.SHORT);
      })
      .finally(() => {
        setTimeout(() => {
          setItems({
            ...items,
            isLoaded: true,
            isInternet: true,
          });
        }, 1);
      });
  };

  const refresh = () => {
    setIsInternet(true);
    setIsError(false);
    setItems({
      ...items,
      isLoaded: false,
      isInternet: true,
      isError: false,
    }),
      loadData();
  };
  const handleFilter = val => {
    setItems({
      ...items,
      isClicked: true,
    });
    loadData(val);
  };
  useEffect(() => {
    setIsAllLoaded(false);
    loadData(filter);
  }, []);
  function searchHistory(val) {
    setSearchValue(val);
    if (val != '') {
      let filtered = allResponse.filter(
        g =>
          g.facilityName.toLowerCase().match(val.toLowerCase()) ||
          g.name.toLowerCase().match(val.toLowerCase()),
      );
      if (filterDate) {
        filtered = filtered.filter(g => new Date(g.bookingDate).toDateString() === new Date(filterDate).toDateString())
        setResponse(filtered);
      } else {
        setResponse(filtered)
      }
    } else if (filterDate) {
      let filtered = allResponse.filter(g => new Date(g.bookingDate).toDateString() === new Date(filterDate).toDateString())
      setResponse(filtered);
    } else {
      setResponse(allResponse);
    }
  }
  // Date Picker Start //

  const [show, setShow] = useState('');
  const handleShow = from => {
    setShow(from);
  };
  const onChangeDate = (date) => {
    setShow('');
    setFilterDate(date)
  };

  useEffect(() => { searchHistory(searchValue) }, [filterDate])
  // Date Picker End //
  const Item = ({ item }) => (
    <View style={{ padding: 10, paddingBottom: 0 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('BookingDetail', { id: item.id })}>
        <View key={item.id} style={styles.historyCard}>
          {item.isCanceled && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                backgroundColor: '#fffffff1',
                zIndex: 2,
                justifyContent: 'center',
                alignItems: 'center',
                right: 0,
                left: 0,
                bottom: 0,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderRadius: 3,
              }}>
              <Text
                style={{
                  transform: [{ rotate: '-20deg' }],
                  fontWeight: 'bold',
                  borderWidth: 2,
                  color: 'gray',
                  borderColor: 'gray',
                  padding: 5,
                  paddingRight: 3,
                  borderRadius: 3,
                }}>
                Cancelled
              </Text>
            </View>
          )}
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Image
                style={{
                  height: 45,
                  width: 45,
                  margin: 'auto',
                  borderWidth: 1,
                  borderColor: 'green',
                  borderRadius: 500,
                }}
                source={
                  item.imageUrl
                    ? { uri: item.imageUrl }
                    : require('../../assets/imgs/noimage.png')
                }
              />
              {item.isPro && (
                <Text
                  style={{
                    position: 'absolute',
                    top: -5,
                    left: 25,
                    color: 'white',
                    paddingHorizontal: 3,
                    borderRadius: 5,
                    backgroundColor: Colors.red,
                    textTransform: 'uppercase',
                    fontSize: 10,
                  }}>
                  Pro
                </Text>
              )}
            </View>
            <Text style={{ width: 220, marginLeft: 13, fontWeight: 'bold' }}>
              {item.name}
            </Text>
            <Text styles={{ fontSize: 16 }}>
              <Icon name="inr" color="green" />
              <Text style={{ fontWeight: 'bold' }}> {item.amount}</Text>
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginRight: 3,
              justifyContent: 'space-between',
            }}>
            <Text style={{ left: 57, color: '#252627' }}>
              {item.timeAgo}
              {/* <TimeAgo time={item.timeStamp} interval={100} /> */}
            </Text>
            <Text style={{ right: 20, color: '#252627' }}>{item.slot}</Text>
            <Text style={{ right: 25, color: '#252627' }}>
              {item.facilityName}
            </Text>
            {/* <TouchableWithoutFeedback onPress={() => Linking.openURL(`tel:${item.phoneNumber}`)}>
                        <Text>Tab to contact <Icon name="phone" size={15} color="green" /></Text>
                    </TouchableWithoutFeedback> */}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
  const renderItem = ({ item }) => <Item item={item} />;

  return (
    <>
      {!items.isLoaded && items.isInternet ? (
        <PreLoader />
      ) : !isInternet ? (
        <NoInternet
          refresh={refresh}
          error={isInternet == false ? true : isError ? false : null}
        />
      ) : (
        <View style={styles.container}>
          <WaitModal modalVisible={items.isClicked} />
          <View style={{ padding: 5 }}>
            <TextInput
              style={{
                width: '100%',
                borderColor: 'gray',
                borderWidth: 1,
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 5,
              }}
              placeholder="Search"
              value={searchValue}
              onChangeText={val => searchHistory(val)}
            />
          </View>
          <View style={stylesIn.inputContainer}>
            <TouchableOpacity onPress={() => handleShow('filterDate')}>
              <TextInput
                value={
                  filterDate
                    ? new Date(filterDate).toDateString()
                    : ''
                }
                placeholder="Search By Date"
                style={stylesIn.input}
                selectionColor={Colors.red}
                editable={false}
              />
            </TouchableOpacity>
            {Platform.OS === 'ios' ?
              <DatePicker
                open={show === 'filterDate'}
                date={filterDate ? new Date(filterDate) : new Date()}
                mode='date'
                modal
                onConfirm={(date) => onChangeDate(date)
                }
                onCancel={() => {
                  handleShow('');
                }}
              /> : show === 'filterDate' && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={filterDate ? new Date(filterDate) : new Date()}
                  mode={new Date()}
                  is24Hour={false}
                  display="default"
                  onChange={(event, date) =>
                    Platform.OS === "ios" ? onChangeDate(date) : event.type == 'set'
                      ? onChangeDate(date)
                      : handleShow('')
                  }
                />
              )}
            <FontAwesome
              onPress={() => handleShow('filterDate')}
              name="calendar"
              color={Colors.blue}
              style={stylesIn.calendarIcon}
              size={20}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            {filers.map((item, index) => (
              <SelectButton
                key={index}
                label={item}
                value={item}
                onSelectValue={val => {
                  setFilter(val);
                  setFilterDate('')
                  setSearchValue('');
                  handleFilter(val);
                }}
                selectedValue={filter}
                selectedColor={Colors.red}
                style={{
                  borderRadius: 50,
                  padding: 10,
                  paddingHorizontal: 15,
                }}
                labelStyle={{ color: Colors.red }}
              />
            ))}
          </View>
          <FlatList
            ListEmptyComponent={() => (
              <View
                style={{
                  alignItems: 'center',
                  flex: 1,
                  minHeight: '100%',
                  height: 500,
                  justifyContent: 'center',
                }}>
                <Text style={{ color: 'red' }}>No Bookings</Text>
              </View>
            )}
            ListFooterComponent={() =>
              response.length != 0 ? (
                <FlatlistFooter
                  isAllLoaded={isAllLoaded}
                  message="No more items to show."
                />
              ) : null
            }
            data={response}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            onEndReachedThreshold={0.2}
            onEndReached={() => loadMore(filter)}
            refreshControl={
              <RefreshControl
                refreshing={!items.isLoaded}
                onRefresh={onRefresh}
              />
            }
          />
        </View>
      )}
    </>
  );
};

export default Bookings;

const stylesIn = StyleSheet.create({
  inputContainer: {
    marginVertical: 10,
    marginHorizontal: 5
  },
  label: {
    color: Colors.gray,
    marginBottom: 5,
  },
  input: {
    borderColor: Colors.gray,
    color: Colors.black,
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: Platform.OS === 'ios' ? 15 : 5,
    paddingHorizontal: 10,
  },
  calendarIcon: {
    position: 'absolute',
    right: 10,
    top: '30%',
  },
})