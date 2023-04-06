import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, Image, Linking, Dimensions, TouchableOpacity } from 'react-native';
import Toast from 'react-native-simple-toast';
import Share from 'react-native-share';
import { AirbnbRating } from 'react-native-elements';
import {
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { UserContext } from '../../settings/Context';
import PreLoader, { WaitModal } from '../../utilities/PreLoader';
import { CFetch } from '../../settings/APIFetch';
import Colors from '../../settings/Colors';
import NoInternet from '../../utilities/NoInternet';
import ViewShot, { captureScreen } from 'react-native-view-shot';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const BookingDetail = ({ navigation, route }) => {
  const { token } = useContext(UserContext);
  const [items, setItems] = useState({
    isEditing: false,
    isClicked: false,
    isReadOnly: false,
    isLoaded: false,
    isInternet: true,
  });
  const [isInternet, setIsInternet] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [isError, setIsError] = useState(false);
  const [response, setResponse] = useState(null);

  const [rat, setRating] = useState({
    isRating: true,
    area: 0,
    surround: 0,
    water: 0,
    washroom: 0,
    helpnature: 0,
    average: 0,
  });
  const share = async name => {
    setIsClicked(true);
    try {
      const uri = await captureScreen({
        format: 'png',
        quality: 0.1,
      });
      await Share.open({
        title: name,
        url: uri,
        message:
          'Install this app and get ground booking online, AppLink: https://sportslovez.in/Apps, You can find opponents, umpires.. Download now',
      }).finally(() => {
        setIsClicked(false);
      });
    } catch (error) {
      setIsClicked(false);
      console.log(error);
    }
  };
  const loadData = () => {
    CFetch('/Management/BookingHistoryById?id=' + route.params.id, token, {})
      .then(res => {
        if (res.status == 200) {
          res.json().then(result => {
            setResponse(result);
            setTimeout(() => {
              navigation.setOptions({
                headerRight: () => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableWithoutFeedback
                      style={{ marginRight: 20 }}
                      onPress={() =>
                        Linking.openURL(`tel:${result.phoneNumber}`)
                      }>
                      <Icon name="phone" size={20} color="white" />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      onPress={() => share(result.name)}
                      style={{
                        marginRight: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <MaterialIcon
                        name="share-variant"
                        color={'white'}
                        size={20}
                      />
                    </TouchableWithoutFeedback>
                  </View>
                ),
              });
            }, 100);
            setRating({
              ...rat,
              area: result.activityArea,
              surround: result.surrounding,
              water: result.drinkingWater,
              washroom: result.washRoom,
              helpnature: result.helpingNature,
              average: result.average.toFixed(1),
              comment: result.comment,
            });
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
        }, 100);
      });
  };
  useEffect(() => {
    loadData();
  }, []);
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

  return (
    <>
      {!items.isLoaded && items.isInternet ? (
        <PreLoader />
      ) : !isInternet ? (
        <NoInternet
          refresh={refresh}
          error={isInternet == false ? true : isError ? false : null}
        />
      ) : response != null ? (
        <ViewShot>
          <WaitModal modalVisible={isClicked} />
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <View
                style={[
                  styles.row,
                  { alignItems: 'flex-start', justifyContent: 'space-between' },
                ]}>
                <View>
                  <View style={{}}>
                    <Text
                      style={{
                        marginRight: 5,
                        color: 'green',
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                      }}>
                      {response.sportsName} - {response.facilityName}
                    </Text>
                  </View>
                  <View style={{ marginRight: 20 }}>
                    <Text
                      style={{
                        marginRight: 5,
                        top: 3,
                        maxWidth: width - 150,
                        color: 'black',
                        fontWeight: 'bold',
                        lineHeight: 25,
                      }}>
                      {response.name}, {response.address}
                    </Text>
                  </View>
                  {response.isCanceled ? (
                    <MaterialIcon
                      name="close-circle"
                      style={{ top: 10 }}
                      size={25}
                      color={Colors.red}
                    />
                  ) : (
                    <MaterialIcon
                      name="check-decagram"
                      style={{ top: 10 }}
                      size={25}
                      color="green"
                    />
                  )}
                </View>

                <View
                  style={{
                    alignItems: 'center',
                    right: 0,
                  }}>
                  {response.profileImage != null ? (
                    <Image
                      style={{
                        width: 80,
                        height: 80,
                        right: 0,
                        borderRadius: 500,
                      }}
                      source={{ uri: response.profileImage }}
                    />
                  ) : (
                    <Image
                      style={{
                        width: 80,
                        height: 80,
                        right: 0,
                        borderRadius: 500,
                      }}
                      source={require('../../assets/imgs/noimage.png')}
                    />
                  )}
                  {response.isPro && (
                    <Text
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
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
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'black',
                    }}>
                    {response.userName}
                  </Text>
                </View>
              </View>
              <View style={{ marginVertical: 15 }}>
                <View
                  style={{
                    borderStyle: 'dotted',
                    borderRadius: 1,
                    borderColor: '#afafaf',
                    borderWidth: 0.8,
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: -15,
                    alignItems: 'center',
                    width: '100%',
                    backgroundColor: 'transparent',
                  }}>
                  <Text
                    style={{
                      margin: 'auto',
                      backgroundColor: '#f1f1f1',
                      fontSize: 18,
                      color: 'gray',
                      paddingHorizontal: 5,
                    }}>
                    Booking Detail
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.row,
                  {
                    justifyContent: 'space-between',
                  },
                ]}>
                <Text>Amount</Text>
                <Text style={{ marginLeft: 'auto' }}>:- </Text>
                <Text style={styles.txt}>
                  ₹ {response.amount} /-
                </Text>
              </View>
              <View
                style={[
                  styles.row,
                  {
                    justifyContent: 'space-between',
                  },
                ]}>
                <Text>Booked On</Text>
                <Text style={{ marginLeft: 'auto' }}>:-</Text>
                <Text style={styles.txt}>
                  {' '}
                  {new Date(response.timeStamp).toUTCString().slice(0, 16)}
                </Text>
              </View>
              {response.slotid != '' || response.slotid != null ? (
                response.facilityName != 'Academy' ? (
                  <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <Text>Booked Slot</Text>
                    <Text style={{ marginLeft: 'auto' }}>:-</Text>
                    <Text style={styles.txt}>
                      {' '}
                      <Icon name="clock-o" size={16} color="green" />{' '}
                      {response.bookingDate.substring(11, 16).split(':')[0] >=
                        12
                        ? response.bookingDate.substring(11, 16).split(':')[0] >
                          12
                          ? (
                            response.bookingDate
                              .substring(11, 16)
                              .split(':')[0] - 12
                          ).toString().length == 1
                            ? '0' +
                            (
                              response.bookingDate
                                .substring(11, 16)
                                .split(':')[0] - 12
                            ).toString() +
                            ':' +
                            response.bookingDate
                              .substring(11, 16)
                              .split(':')[1] +
                            ' PM'
                            : response.bookingDate
                              .substring(11, 16)
                              .split(':')[0] -
                            12 +
                            ':' +
                            response.bookingDate
                              .substring(11, 16)
                              .split(':')[1] +
                            ' PM'
                          : response.bookingDate.substring(11, 16) + ' PM'
                        : response.bookingDate
                          .substring(11, 16)
                          .split(':')[0] == '00'
                          ? parseInt(
                            response.bookingDate
                              .substring(11, 16)
                              .split(':')[0],
                          ) +
                          12 +
                          ':00' +
                          ' AM'
                          : response.bookingDate.substring(11, 16) + ' AM'}{' '}
                      ({response.slot != null ? response.slot : 'Na'})
                    </Text>
                  </View>
                ) : null
              ) : null}
              {response.sportsName === "Cricket" && response.facilityName === "Ground" &&
                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                  <Text>Team</Text>
                  <Text style={{ marginLeft: 'auto' }}>:-</Text>
                  <Text style={styles.txt}>
                    {' '}
                    {'  '}
                    {response.team && response.team2 ? "2" : "1"}{' '}
                  </Text>
                </View>
              }
              {response.sportsName !== "Cricket"
                || response.facilityName !== "Ground" &&
                response.numberOfPersons > 0 &&
                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                  <Text>Persons</Text>
                  <Text style={{ marginLeft: 'auto' }}>:-</Text>
                  <Text style={styles.txt}>
                    <MaterialCommunityIcons name="account" size={15} color={Colors.blue} />
                    {' '}
                    {response.numberOfPersons}
                  </Text>
                </View>}
              <View style={[styles.row, { justifyContent: 'space-between' }]}>
                <Text>Validity</Text>
                <Text style={{ marginLeft: 'auto' }}>:-</Text>
                <Text style={styles.txt}>
                  {' '}
                  {response.stringEndDate + ' '}
                  {response.endDate.substring(11, 16).split(':')[0] >= 12
                    ? response.endDate.substring(11, 16).split(':')[0] > 12
                      ? (
                        response.endDate.substring(11, 16).split(':')[0] - 12
                      ).toString().length == 1
                        ? '0' +
                        (
                          response.endDate.substring(11, 16).split(':')[0] -
                          12
                        ).toString() +
                        ':' +
                        response.endDate.substring(11, 16).split(':')[1] +
                        ' PM'
                        : response.endDate.substring(11, 16).split(':')[0] -
                        12 +
                        ':' +
                        response.endDate.substring(11, 16).split(':')[1] +
                        ' PM'
                      : response.endDate.substring(11, 16) + ' PM'
                    : response.endDate.substring(11, 16).split(':')[0] == '00'
                      ? parseInt(
                        response.endDate.substring(11, 16).split(':')[0],
                      ) +
                      12 +
                      ':00' +
                      ' AM'
                      : response.endDate.substring(11, 16) + ' AM'}
                </Text>
              </View>
              <>
                {response.team ?
                  <>
                    <View style={{ marginVertical: 15 }}>
                      <View
                        style={{
                          borderStyle: 'dotted',
                          borderRadius: 1,
                          borderColor: '#afafaf',
                          borderWidth: 0.8,
                        }}
                      />
                      <View
                        style={{
                          position: 'absolute',
                          top: -15,
                          alignItems: 'center',
                          width: '100%',
                          backgroundColor: 'transparent',
                        }}>
                        <Text
                          style={{
                            margin: 'auto',
                            backgroundColor: '#f1f1f1',
                            fontSize: 18,
                            color: 'gray',
                            paddingHorizontal: 5,
                          }}>
                          Team 1 Detail
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.row, { justifyContent: 'space-between' }]}>
                      <Text>Team</Text>
                      <Text style={{ marginLeft: 'auto' }}>:- </Text>
                      <Text style={styles.txt}>{response.team}</Text>
                    </View>

                    <View style={[styles.row, { justifyContent: 'space-between' }]}>
                      <Text>Contact Name</Text>
                      <Text style={{ marginLeft: 'auto' }}>:- </Text>
                      <Text style={styles.txt}>{response.teamContactName}</Text>
                    </View>
                    <View style={[styles.row, { justifyContent: 'space-between' }]}>
                      <Text>Phone Number</Text>
                      <Text style={{ marginLeft: 'auto' }}>:- </Text>
                      <TouchableOpacity onPress={() => { Linking.openURL("tel:" + response.teamPhoneNumber) }}>
                        <Text style={[styles.txt, { color: Colors.blue }]}>
                          {response.teamPhoneNumber}</Text>
                      </TouchableOpacity>
                    </View>
                  </> : null}
              </>
              {response.team2 ?
                <>
                  <View style={{ marginVertical: 15 }}>
                    <View
                      style={{
                        borderStyle: 'dotted',
                        borderRadius: 1,
                        borderColor: '#afafaf',
                        borderWidth: 0.8,
                      }}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        top: -15,
                        alignItems: 'center',
                        width: '100%',
                        backgroundColor: 'transparent',
                      }}>
                      <Text
                        style={{
                          margin: 'auto',
                          backgroundColor: '#f1f1f1',
                          fontSize: 18,
                          color: 'gray',
                          paddingHorizontal: 5,
                        }}>
                        Team 2 Detail
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <Text>Team</Text>
                    <Text style={{ marginLeft: 'auto' }}>:- </Text>
                    <Text style={styles.txt}>{response.team2}</Text>
                  </View>
                  <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <Text>Contact Name</Text>
                    <Text style={{ marginLeft: 'auto' }}>:- </Text>
                    <Text style={styles.txt}>{response.team2ContactName}</Text>
                  </View>
                  <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <Text>Phone Number</Text>
                    <Text style={{ marginLeft: 'auto' }}>:- </Text>
                    <TouchableOpacity onPress={() => { Linking.openURL("tel:" + response.team2PhoneNumber) }}>
                      <Text style={[styles.txt, { color: Colors.blue }]}>
                        {response.team2PhoneNumber}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
                : null
              }
              {response.isCanceled == true ? (
                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                  <Text>Cancel Date</Text>
                  <Text style={{ marginLeft: 'auto' }}>:-</Text>
                  <Text style={styles.txt}>
                    {' '}
                    {new Date(response.cancelDate).toUTCString().slice(0, 16)}
                  </Text>
                </View>
              ) : null}
              {response.isRefund == true && response.isCanceled == true ? (
                <>
                  <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <Text>Refund Amount</Text>
                    <Text style={{ marginLeft: 'auto' }}>:-</Text>
                    <Text style={styles.txt}>
                      {' '}
                      ₹ {response.refundAmount} /-
                    </Text>
                  </View>
                </>
              ) : response.isCanceled == true ? (
                <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>
                  No Amount Refunded
                </Text>
              ) : null}
              {new Date(response.endDate).getTime() <
                new Date(response.currentTime).getTime() &&
                response.isCanceled == false ? (
                <View style={{ marginTop: 0 }}>
                  <Title>Help us to serve better</Title>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View>
                      <View style={[styles.row, styles.ratingContainer]}>
                        <Text style={{ fontSize: 16, marginRight: 10 }}>
                          {(response.sportsName + response.facilityName)
                            .toString()
                            .toLowerCase()
                            .includes('umpire')
                            ? 'Punctual:'
                            : (response.sportsName + response.facilityName)
                              .toString()
                              .toLowerCase()
                              .includes('academy')
                              ? 'Activity area:'
                              : 'Pitch:'}
                        </Text>
                        <AirbnbRating
                          count={5}
                          defaultRating={rat.area}
                          isDisabled={rat.isRating}
                          showRating={false}
                          size={20}
                          onFinishRating={rating =>
                            setRating({ ...rat, area: rating })
                          }
                        />
                      </View>
                      <View style={[styles.row, styles.ratingContainer]}>
                        <Text style={{ fontSize: 16, marginRight: 10 }}>
                          {(response.sportsName + response.facilityName)
                            .toString()
                            .toLowerCase()
                            .includes('umpire')
                            ? 'Dress code:'
                            : (response.sportsName + response.facilityName)
                              .toString()
                              .toLowerCase()
                              .includes('academy')
                              ? 'Surrounding:'
                              : 'Ground:'}
                        </Text>
                        <AirbnbRating
                          count={5}
                          defaultRating={rat.surround}
                          isDisabled={rat.isRating}
                          showRating={false}
                          size={20}
                          onFinishRating={rating =>
                            setRating({ ...rat, surround: rating })
                          }
                        />
                      </View>
                      <View style={[styles.row, styles.ratingContainer]}>
                        <Text style={{ fontSize: 16, marginRight: 10 }}>
                          {(response.sportsName + response.facilityName)
                            .toString()
                            .toLowerCase()
                            .includes('umpire')
                            ? 'Fair decision:'
                            : 'Drinking Water:'}
                        </Text>
                        <AirbnbRating
                          count={5}
                          defaultRating={rat.water}
                          isDisabled={rat.isRating}
                          showRating={false}
                          size={20}
                          onFinishRating={rating =>
                            setRating({ ...rat, water: rating })
                          }
                        />
                      </View>
                      <View style={[styles.row, styles.ratingContainer]}>
                        <Text style={{ fontSize: 16, marginRight: 10 }}>
                          {(response.sportsName + response.facilityName)
                            .toString()
                            .toLowerCase()
                            .includes('umpire')
                            ? 'Professional:'
                            : (response.sportsName + response.facilityName)
                              .toString()
                              .toLowerCase()
                              .includes('academy')
                              ? 'Washroom:'
                              : 'Helping Nature:'}
                        </Text>
                        <AirbnbRating
                          count={5}
                          defaultRating={rat.washroom}
                          isDisabled={rat.isRating}
                          showRating={false}
                          size={20}
                          onFinishRating={rating =>
                            setRating({ ...rat, washroom: rating })
                          }
                        />
                      </View>
                      <View style={[styles.row, styles.ratingContainer]}>
                        <Text style={{ fontSize: 16, marginRight: 10 }}>
                          {(response.sportsName + response.facilityName)
                            .toString()
                            .toLowerCase()
                            .includes('umpire')
                            ? 'Knowledge:'
                            : 'Value for Money:'}
                        </Text>
                        <AirbnbRating
                          count={5}
                          defaultRating={rat.helpnature}
                          isDisabled={rat.isRating}
                          showRating={false}
                          size={20}
                          onFinishRating={rating =>
                            setRating({ ...rat, helpnature: rating })
                          }
                        />
                      </View>
                    </View>
                    {rat.average != 0 && (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                          marginBottom: 15,
                          marginRight: 5,
                          borderRadius: 5,
                          borderWidth: 1,
                          backgroundColor: 'green',
                          borderColor: 'green',
                          paddingVertical: 2,
                          paddingHorizontal: 5,
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: 'white',
                            alignItems: 'center',
                          }}>
                          {rat.average}
                        </Text>
                        <Icon
                          name="star"
                          style={{ marginLeft: 5, color: 'white' }}
                        />
                      </View>
                    )}
                  </View>
                  <View>
                    <TextInput
                      placeholder="Comment"
                      multiline
                      numberOfLines={3}
                      style={{
                        borderBottomColor: '#a5a5a5',
                        textAlignVertical: 'top',
                        height: 80,
                        backgroundColor: '#e0e0e0',
                        marginBottom: 5,
                        borderBottomWidth: 2,
                      }}
                      editable={!rat.isRating}
                      value={rat.comment}
                      onChangeText={val => setRating({ ...rat, comment: val })}
                    />
                  </View>
                </View>
              ) : null}
            </View>
          </ScrollView>
        </ViewShot>
      ) : null}
    </>
  );
};

export default BookingDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 10,
    paddingLeft: 20,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  txt: { fontWeight: 'bold', width: 210 },
  ratingContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
