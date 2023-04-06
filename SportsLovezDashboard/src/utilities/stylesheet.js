import {
  StyleSheet, Animated, Component, MapView, Modal, Pressable, ImageBackground,
  Dimensions, Button, Image, Text, View, Alert, TouchableOpacity, TextInput,
  ScrollView,
  Platform
} from 'react-native';

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  loginContainer: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container_inner: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'white'
  },
  headerContainer: {
    width: '100%',
    height: '100%',
    flex: 1.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#011046bf",
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  card: {
    justifyContent: 'center', marginBottom: 10, elevation: 10,
    alignContent: 'center', borderRadius: 10, backgroundColor: 'white'
  },
  chatCard: {
    padding: 8, marginBottom: 10, height: 80, minHeight: 80, elevation: 10,
    backgroundColor: 'white', borderRadius: 3, borderTopColor: 'orange', borderTopWidth: 3
  },
  historyCard: {
    padding: 8, marginBottom: 10, height: 80,
    minHeight: 80, backgroundColor: 'white', elevation: 2,
    borderRadius: 3, borderTopColor: 'orange', borderTopWidth: 3
  },
  chatMessage: {
    width: '80%', backgroundColor: 'white',
    padding: 8, borderRadius: 3, elevation: 2
  },
  sendPost: {
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-around',
    width: '100%', backgroundColor: '#252627', padding: 10,
    borderRadius: 5, elevation: 20
  },
  sentPostHeading: {
    justifyContent: 'flex-end',
    margin: 10, paddingBottom: 5, alignItems: 'flex-start',
    borderBottomWidth: 2, borderColor: '#20095d'
  },
  sentPost: {
    padding: 8, marginBottom: 10, height: 100, minHeight: 100,
    backgroundColor: 'white', borderRadius: 3, elevation: 2,
    borderTopColor: 'orange', borderTopWidth: 3
  },
  sendMessage: {
    elevation: 1, paddingLeft: 10, borderRadius: 5,
    marginRight: 10, paddingRight: 10,
    backgroundColor: 'white', width: '90%',
    maxHeight: 75, height: 75
  },
  input: {
    backgroundColor: "transparent",
    color: "black",
    paddingLeft: 20,
    width: "100%",
    borderBottomWidth: 1.7,
    borderBottomColor: "#c3bcbc",
    borderRadius: 4,
  },
  inputField: {
    color: 'black',
    paddingVertical: 10
  },
  icon: {
    position: 'absolute',
    left: 4,
    bottom: 18,
  },
  btn: {
    alignItems: 'flex-end',
    marginTop: 15,
  },
  signIn: {
    width: 180,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
  },
  profileBtn: {
    width: 100,
    marginRight: 10,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
  },
  forgetBtn: {
    marginTop: 10,
    width: '100%',
    alignItems: 'flex-end'
  },
  button: {
    marginTop: 15,
    borderRadius: 5,
    elevation: 2,
    backgroundColor: "#009783",
    borderRadius: 10,
    fontWeight: "bold",
    textAlign: "center"
  },
  textStyle: {
    color: "white",
  },
  showhide: {
    position: 'absolute',
    right: 25,
    justifyContent: 'center',
    bottom: '35%'

  },
  errorMsg: {
    color: 'red',
    textAlign: 'left',
    width: "100%"
  },
  successMsg: {
    color: 'green',
    textAlign: 'left',
    width: "100%"
  },
  guest: {
    backgroundColor: '#f2f2f2',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TandP: {
    color: '#990000',
    textDecorationLine: 'underline'
  },
  startFooter: {
    flex: 3.5,
    backgroundColor: "#fff",
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: height_logo,
    height: height_logo
  },
  title: {
    color: "#05375a",
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    color: "grey",
    marginTop: 5,
  },
  button: {
    alignItems: 'flex-end',
    marginTop: 30,
  },
  startBtn: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
  },
  textSign: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  caption: {
    paddingTop: 10,
    zIndex: 9999999,
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    //marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginBottom: 15,
  },
  bottomDrawerSection: {
    marginBottom: 0,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  // profile css //
  profileSettingsContainer: {
    flex: 1,
    padding: 20,
    width: '100%'
  },
  profileImageContainer: {
    top: 20,
    width: 240,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageBtn: {
    borderRadius: 50,
    marginRight: 10,
    borderWidth: 1.7,
    borderColor: 'green'
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileSettings: {
    marginTop: 20,
    flex: 3,
  },
  map: {
    height: 400,
    width: 300,
  },
});
export default styles;