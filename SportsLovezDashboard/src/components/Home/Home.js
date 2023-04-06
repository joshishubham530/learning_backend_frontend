import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Header from '../../utilities/Header';
import styles from '../../utilities/stylesheet';
import {UserContext, AuthContext} from '../../settings/Context';
import PreLoader, {WaitModal} from '../../utilities/PreLoader';
import {CFetch} from '../../settings/APIFetch';
import Colors from '../../settings/Colors';
import FlatlistFooter from '../../utilities/FlatListFooter';
import {useFocusEffect} from '@react-navigation/native';
const Home = ({navigation}) => {
  const {token, userName} = useContext(UserContext);
  const [items, setItems] = useState({
    isEditing: false,
    isClicked: false,
    isError: false,
    isReadOnly: false,
    isLoaded: false,
    isInternet: true,
  });
  const [screenLoad, setScreenLoad] = useState(false);
  const [response, setResponse] = useState([]);
  const [isAllLoaded, setIsAllLoaded] = useState(false);
  const [skip, setSkip] = useState(0);
  const onRefresh = useCallback(() => {
    setItems({...items, isLoaded: false});
    loadData();
  }, []);
  const {signOut} = useContext(AuthContext);

  const loadMore = () => {
    CFetch('/Management/Facilities?skip=' + skip, token, {})
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
  const loadData = () => {
    CFetch('/Management/Facilities/', token, {})
      .then(res => {
        if (res.status == 200) {
          res.json().then(result => {
            setResponse(result);
            setSkip(10);
          });
        } else if (res.status == 403) {
          setScreenLoad(true);
          signOut();
        } else {
          setScreenLoad(true);
          setItems({
            ...items,
            isInternet: true,
            isClicked: false,
            isError: true,
          });
          Toast.show('Something went wrong, try again.', Toast.SHORT);
        }
      })
      .catch(error => {
        setScreenLoad(true);
        setItems({
          ...items,
          isInternet: false,
          isError: false,
        });
        Toast.show('No Internet Connection.', Toast.SHORT);
      })
      .finally(() => {
        setTimeout(() => {
          setItems({
            ...items,
            isLoaded: true,
            isInternet: true,
            isClicked: false,
            isError: false,
          });
          setScreenLoad(true);
        }, 10);
      });
  };
  useFocusEffect(
    useCallback(() => {
      setItems({
        ...items,
        isClicked: true,
      });
      loadData();
      return () => false;
    }, []),
  );
  useEffect(() => {
    loadData();
  }, []);

  function handleDeleteFacility(id) {
    setItems({
      ...items,
      isClicked: true,
    });
    CFetch('/Management/EnableDisableFacility?id=' + id, token, {})
      .then(res => {
        if (res.status == 200) {
          loadData();
          // setItems({
          //     ...items,
          //     isClicked: false,
          // })
        } else {
          Toast.show('Something went wrong, try again', Toast.SHORT);
        }
      })
      .catch(error => {
        setItems({
          ...items,
          isInternet: false,
        });
      });
  }
  const Item = ({item}) => (
    <View style={{padding: 10}}>
      <View key={response.id} style={styles.card}>
        <TouchableOpacity
          onPress={() =>
            item.facilityType != 'Academy'
              ? navigation.navigate('Configure', {id: item.id, name: item.name})
              : navigation.navigate('UpdateFacility', {id: item.id})
          }>
          <View style={{flex: 1, marginBottom: 10}}>
            <Image
              style={{
                width: '100%',
                height: 180,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
              source={{uri: item.singleImage}}
            />
          </View>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', padding: 10}}>
          <View style={{flex: 3}}>
            <Text style={{textAlign: 'left'}}>{item.name}</Text>
            <Text style={{textAlign: 'left', color: 'green'}}>
              {item.sports} - {item.facilityType}
            </Text>
          </View>
          <View style={{marginRight: 20}}>
            {item.isActive ? (
              <TouchableOpacity onPress={() => handleDeleteFacility(item.id)}>
                <Icon name="toggle-on" color="green" size={20} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => handleDeleteFacility(item.id)}>
                <Icon name="toggle-off" color="red" size={20} />
              </TouchableOpacity>
            )}
          </View>
          <View style={{marginRight: 20}}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('UpdateFacility', {id: item.id})
              }>
              <Icon name="pencil" color="green" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderItem = ({item}) => <Item item={item} />;

  return (
    <>
      <Header title="My Facilities" isShow={true} />
      {items.isLoaded == true ? (
        <WaitModal modalVisible={items.isClicked} />
      ) : null}
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
            onPress={() => {
              setItems({...items, isLoaded: false, isInternet: true}),
                loadData();
            }}
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
          <FlatList
            ListFooterComponent={() => (
              <FlatlistFooter
                isAllLoaded={items.isLoaded}
                message="No more items to show."
              />
            )}
            ListEmptyComponent={() => (
              <View
                style={{
                  alignItems: 'center',
                  flex: 1,
                  minHeight: '100%',
                  height: 500,
                  justifyContent: 'center',
                }}>
                <Text style={{color: 'red'}}>No Facilities</Text>
                <View
                  style={{
                    justifyContent: 'space-around',
                    marginTop: 10,
                  }}>
                  <Button
                    title="      Add      "
                    onPress={() => navigation.navigate('AddFacility')}
                  />
                </View>
              </View>
            )}
            data={response}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
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

export default Home;
