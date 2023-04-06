import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  Pressable,
  Dimensions,
  Linking,
  SafeAreaView,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { ScrollView } from 'react-native-gesture-handler';
import { Title } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import PreLoader from '../../utilities/PreLoader';
import styles from '../../utilities/stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../settings/Colors';
import { Picker } from '@react-native-picker/picker';
import { CFormFetch } from '../../settings/APIFetch';
import { UIActivityIndicator } from 'react-native-indicators';
import DocumentPicker from 'react-native-document-picker';
import { UserContext } from '../../settings/Context';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const Help = ({ navigation }) => {
  const { userName, phoneNumber } = useContext(UserContext);
  const [item, setItem] = useState({
    isLoaded: false,
    isClicked: false,
    isEmpty: false,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [showImage, setShowImage] = useState([]);
  const [response, setResponse] = useState({
    feedback: '',
    Name: '',
    Description: '',
    PhoneNumber: '',
    Email: '',
    img: [],
  });
  useEffect(() => {
    setItem({
      ...item,
      isLoaded: true,
    });
  }, []);
  var array = [];
  async function SelectImage() {
    try {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      });
      if (res.length <= 5) {
        res.forEach(element => {
          if (array.length <= 5) {
            array.push(element);
          } else {
            Toast.show('Max 5 images are allowed', Toast.LONG);
          }
        });
        setResponse({ ...response, img: array });
        setShowImage(array);
      } else {
        Toast.show('Max 5 images are allowed', Toast.LONG);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log(err);
      } else {
        throw err;
      }
    }
  }

  const handleEnquiry = () => {
    if (response.Name == '' || response.Description == '') {
      setItem({ ...item, isEmpty: true });
    } else {
      setItem({ ...item, isClicked: true, isEmpty: false });
      var formData = new FormData();
      formData.append('Name', response.Name);
      formData.append('Email', userName);
      formData.append('Phone', phoneNumber);
      formData.append('Subject', response.feedback);
      formData.append('Message', response.Description);
      if (response.img.length != 0) {
        response.img.map(item => formData.append('Image', item));
      }
      CFormFetch('/Data/Enquiry', null, formData)
        .then(res => {
          if (res.status == 200) {
            setItem({ ...item, isClicked: false, isEmpty: false });
            setResponse({
              feedback: '',
              Name: '',
              Description: '',
              PhoneNumber: '',
              Email: '',
              img: [],
            });
            setShowImage([]);
            Alert.alert('Submitted Successfully');
          } else {
            setItem({ ...item, isClicked: false, isEmpty: false });
            Alert.alert('Something went wrong, please try again later');
          }
        })
        .catch(error => {
          setItem({
            ...item,
            isClicked: false,
            isEmpty: false,
          });
          Toast.show('No Internet Connection.', Toast.SHORT);
        })
        .finally(() => {
          setItem({
            isLoaded: true,
            isClicked: false,
            isEmpty: false,
          });
        });
    }
  };

  return (
    <>
      {!item.isLoaded ? (
        <PreLoader />
      ) : (
        <View style={styles.container}>
          <ScrollView>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 20,
                justifyContent: 'center',
              }}>
              <Icon
                name="phone"
                style={{ marginRight: 10 }}
                color="#20095d"
                size={25}
              />
              <Title style={{ fontSize: 20, color: '#20095d' }}>Call Us</Title>
            </View>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => Linking.openURL('tel:+91-8591719905')}>
                <Title style={{ fontSize: 20 }}>+91-8591719905</Title>
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => Linking.openURL('tel:+91-7015252655')}>
                <Title style={{ fontSize: 20 }}>+91-7015252655</Title>
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Title style={{ fontSize: 20, color: 'grey' }}>or</Title>
            </View>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  borderBottomColor: '#20095d',
                  borderBottomWidth: 4,
                  width: '80%',
                }}
              />
              <Title
                style={{
                  fontSize: 20,
                  color: '#20095d',
                  top: -24,
                  backgroundColor: '#f1f1f1',
                  padding: 5,
                }}>
                Submit Form
              </Title>
            </View>
            <View style={{ padding: 10, alignItems: 'stretch' }}>
              <View style={styles.input}>
                <Picker
                  style={{ marginLeft: 10, left: -15 }}
                  selectedValue={response.feedback}
                  mode="dropdown"
                  onValueChange={(val, index) =>
                    setResponse({ ...response, feedback: val })
                  }>
                  <Picker.Item
                    label="General Feedback"
                    value="General Feedback"
                  />
                  <Picker.Item
                    label="Booking a place/venue"
                    value="Booking a place/venue"
                  />
                  <Picker.Item label="Report a user" value="Report a user" />
                  <Picker.Item
                    label="Report content in app"
                    value="Report content in app"
                  />
                  <Picker.Item
                    label="App feature assistance"
                    value="App feature assistance"
                  />
                  <Picker.Item label="Delete Profile" value="Delete Profile" />
                  <Picker.Item label="Others" value="Others" />
                </Picker>
              </View>
              <View style={styles.input}>
                <TextInput
                  style={styles.inputField}
                  selectionColor="#009783"
                  placeholderTextColor="#949494"
                  value={response.Name}
                  placeholder="Enter your Name*"
                  onChangeText={val => setResponse({ ...response, Name: val })}
                />
              </View>
              {/* <View style={styles.input}>
                                <TextInput style={styles.inputField} selectionColor="#009783" placeholderTextColor="#949494"
                                    value={response.Email} placeholder="Enter your valid email*" onChangeText={(val) => setResponse({ ...response, Email: val })} />
                            </View>
                            <View style={styles.input}>
                                <TextInput style={styles.inputField} selectionColor="#009783" placeholderTextColor="#949494"
                                    value={response.PhoneNumber} placeholder="Enter your 10-digit Mobile Number*" onChangeText={(val) => setResponse({ ...response, PhoneNumber: val })} />
                            </View> */}
              <View
                style={{ marginTop: 10, marginBottom: 10, flexDirection: 'row' }}>
                <Text style={{ textAlign: 'center', marginLeft: 5 }}>
                  Upload a screenshot (optional):
                </Text>
                <TouchableOpacity onPress={() => SelectImage()}>
                  <Text style={{ color: 'blue' }}> Add Image</Text>
                </TouchableOpacity>
              </View>
              {showImage.length != 0 ? (
                <View
                  style={{ marginLeft: 5, flexDirection: 'row', width: '80%' }}>
                  <Text style={{ fontWeight: 'bold' }}>
                    {showImage.length > 1 ? 'Image File:' : 'Image Files:'}{' '}
                  </Text>
                  <Text>
                    {showImage.length == 1
                      ? showImage[0].name
                      : showImage.length}
                  </Text>
                </View>
              ) : null}
              <View style={styles.input}>
                <TextInput
                  style={[
                    styles.inputField,
                    { height: 120, textAlignVertical: 'top' },
                  ]}
                  selectionColor="#009783"
                  placeholderTextColor="#949494"
                  value={response.Description}
                  multiline
                  numberOfLines={5}
                  placeholder="Enter Description*"
                  onChangeText={val =>
                    setResponse({ ...response, Description: val })
                  }
                />
              </View>
              {item.isEmpty ? (
                <Animatable.View
                  style={{ width: '90%' }}
                  animation="fadeInLeft"
                  duration={500}>
                  <Text style={styles.errorMsg}>Please fill all field...</Text>
                </Animatable.View>
              ) : null}
              <View
                style={{
                  justifyContent: 'center',
                  width: '100%',
                  alignItems: 'center',
                  marginTop: 10,
                  marginBottom: 20,
                }}>
                {!item.isClicked ? (
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={() => handleEnquiry()}>
                    <LinearGradient
                      style={styles.signIn}
                      colors={[Colors.blue, Colors.blue, Colors.blue]}>
                      <Text style={styles.textSign}>Submit</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.btn}>
                    <LinearGradient
                      style={styles.signIn}
                      colors={['#66a3ff', '#66a3ee', '#66a3ff']}>
                      <UIActivityIndicator color="white" size={25} />
                    </LinearGradient>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      )}
      <Modal animationType="slide" transparent visible={modalVisible}>
        <SafeAreaView style={{ flex: 1 }}>
          <Pressable
            onPress={() => setModalVisible(false)}
            style={mStyles.modalViewContainer}>
            <Pressable style={mStyles.modalHeight}>
              <Animatable.View animation="fadeInUp" easing="ease-in" duration={5}>
                <View style={mStyles.modalView}>
                  <View style={mStyles.modalHeader}>
                    <Text style={{ fontSize: 20 }}>Choose Image</Text>
                    <Pressable style={{}} onPress={() => SelectImage()}>
                      <Icon name="close" size={25} />
                    </Pressable>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      width: width,
                      height: height - 560,
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={() => SelectImage(1)}>
                      <Icon name="file" color={Colors.red} size={40} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => SelectImage(2)}>
                      <Icon name="camera" color={Colors.blue} size={40} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Animatable.View>
            </Pressable>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default Help;

const mStyles = StyleSheet.create({
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  checkTxt: {
    paddingVertical: 0,
    borderRadius: 2,
  },
  checkBtn: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 2,
    borderColor: Colors.blue,
    borderWidth: 1,
  },
  checkBtnTxt: {
    textAlign: 'center',
    color: Colors.blue,
  },
  modalViewContainer: {
    backgroundColor: '#0a0a0a8f',
    flex: 1,
  },
  modalHeight: {
    height: height - 500,
    top: 500,
    backgroundColor: 'white',
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    padding: 10,
    elevation: 0.8,
    borderColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
});
