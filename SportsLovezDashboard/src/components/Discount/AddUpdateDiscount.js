import React, { useContext, useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { TabRouter, useNavigation } from '@react-navigation/native';
import Colors from '../../settings/Colors';
import { Button, Checkbox, RadioButton } from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'react-native-image-picker';
import { TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import { CFetch, CFormFetch } from '../../settings/APIFetch';
import { UserContext } from '../../settings/Context';
import Toast from 'react-native-simple-toast';
import { WaitModal } from '../../utilities/PreLoader';
import DiscountFacility from './DiscountFacility'
import DatePicker from 'react-native-date-picker';
const AddUpdateDiscount = ({ route }) => {
  const navigation = useNavigation();
  const { token } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [editing, setEditing] = useState(false);

  const [model, setModel] = useState({
    name: '',
    code: '',
    fix: 0,
    percent: 0,
    type: false,
    base: false,
    weekDay: false,
    weekEndDay: false,
    fixDay: false,
    fixDate: '',
    validFrom: '',
    validTo: '',
    image: '',
  });
  const [discountFacility, setDiscountFacility] = useState([])
  const handleFacilityCheckBox = (id) => {
    let array = [...discountFacility];
    let i = array.indexOf(id)
    if (array.includes(id)) {
      array.splice(i, 1)
    } else {
      array.push(id)
    }
    setDiscountFacility(array)
  }
  const handleInput = (name, value) => {
    if (name === 'fixDay' && value === true) {
      setModel({
        ...model,
        [name]: value,
        weekDay: false,
        weekEndDay: false,
      });
    } else {
      setModel({
        ...model,
        [name]: value,
      });
    }
  };
  // Date Picker Start //

  const [show, setShow] = useState('');
  const handleShow = from => {
    setShow(from);
  };
  const onChangeDate = (name, date) => {
    setShow('');
    handleInput(name, date);
  };

  // Date Picker End //

  const selectImage = async name => {
    let options = { maxWidth: 500, maxHeight: 500, quality: 0.5 };
    ImagePicker.launchImageLibrary(options, res => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        handleInput('image', {
          name: res.assets[0].fileName,
          uri: res.assets[0].uri,
          type: res.assets[0].type,
        });
      }
    });
  };
  useEffect(() => {
    setLoading(false);
    setWaiting(false);
    if (route.params) {
      handleEdit(route.params.id);
    }
  }, []);
  const handleSubmit = () => {
    if (
      !model.name ||
      !model.code ||
      !model.percent ||
      !model.fix ||
      !model.validFrom ||
      !model.validTo
    ) {
      Toast.show('Please fill all mandatory fields');
      return false;
    }
    if (model.fixDay && !model.fixDate) {
      Toast.show('Please fill all mandatory fields');
      return false;
    }
    // if (!model.image && !editing) {
    //   Toast.show('Please fill all mandatory fields');
    //   return false;
    // }
    setWaiting(true);
    var formData = new FormData();
    if (editing) {
      formData.append('id', route.params.id);
    }
    if (!editing) {
      discountFacility.map((item) => (
        formData.append('DiscountFacility', item)))
    }
    formData.append('name', model.name);
    formData.append('code', model.code);
    formData.append('fix', model.fix);
    formData.append('percent', model.percent);
    formData.append('validFrom', new Date(model.validFrom).toISOString());
    formData.append('validTo', new Date(model.validTo).toISOString());
    formData.append('type', model.type);
    formData.append('base', model.base);
    formData.append('fixDay', model.fixDay);
    if (model.fixDay) {
      formData.append('fixDate', new Date(model.fixDate).toISOString());
    } else {
      formData.append('weekDay', model.weekDay);
      formData.append('weekEndDay', model.weekEndDay);
    }
    formData.append('image', model.image);
    let url = editing ? 'UpdateDiscount' : 'CreateDiscount';
    CFormFetch('/Management/' + url, token, formData)
      .then(res => {
        if (res.status === 200) {
          res.json().then(result => {
            Toast.show(result.toString());
          });
          setTimeout(() => {
            navigation.goBack();
          }, 1000);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
        setWaiting(false);
      });
  };
  const handleEdit = id => {
    if (!id) {
      return false;
    }
    setWaiting(true);
    CFetch('/Management/GetDiscountById?id=' + id, token, {})
      .then(res => {
        if (res.status === 200) {
          res.json().then(result => {
            setModel(result);
            setEditing(true);
          });
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
        setWaiting(false);
      });
  };
  useEffect(() => {
    if (model.base === false) {
      setDiscountFacility([])
    }
  }, [model.base])
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled">
      <WaitModal modalVisible={waiting} />
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title*</Text>
          <TextInput
            value={model.name}
            placeholder="Title"
            style={styles.input}
            selectionColor={Colors.red}
            onChangeText={val => handleInput('name', val)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Code*</Text>
          <TextInput
            value={model.code}
            placeholder="Code"
            style={styles.input}
            selectionColor={Colors.red}
            onChangeText={val => handleInput('code', val)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Percent (%)*</Text>
          <TextInput
            value={model.percent.toString()}
            placeholder="Percent (%)"
            keyboardType="number-pad"
            style={styles.input}
            selectionColor={Colors.red}
            onChangeText={val => handleInput('percent', val)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Max*</Text>
          <TextInput
            value={model.fix.toString()}
            placeholder="Max"
            keyboardType="number-pad"
            style={styles.input}
            selectionColor={Colors.red}
            onChangeText={val => handleInput('fix', val)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Valid From*</Text>
          <TouchableOpacity onPress={() => handleShow('validFrom')}>
            <TextInput
              value={
                model.validFrom != ''
                  ? new Date(model.validFrom).toDateString()
                  : ''
              }
              placeholder="Valid From"
              style={styles.input}
              selectionColor={Colors.red}
              editable={false}
            />
          </TouchableOpacity>
          {Platform.OS === 'ios' ?
            <DatePicker
              open={show === 'validFrom'}
              date={model.validFrom ? new Date(model.validFrom) : new Date()}
              mode='date'
              is24Hour={false}
              modal
              onConfirm={(date) => { onChangeDate('validFrom', date) }
              }
              onCancel={() => {
                handleShow('')
              }}
              minimumDate={new Date()}
            /> : show === 'validFrom' && (
              <DateTimePicker
                testID="dateTimePicker"
                value={model.validFrom ? new Date(model.validFrom) : new Date()}
                mode="date"
                is24Hour={false}
                display="default"
                onChange={(event, date) => {
                  Platform.OS === "ios" ? onChangeDate('validFrom', date) : event.type == 'set'
                    ? onChangeDate('validFrom', date)
                    : handleShow('')
                }
                }
                minimumDate={new Date()}
              />
            )}
          <FontAwesome
            name="calendar"
            onPress={() => handleShow('validFrom')}
            color={Colors.blue}
            style={styles.calendarIcon}
            size={20}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Valid To*</Text>
          <TouchableOpacity onPress={() => handleShow('validTo')}>
            <TextInput
              value={
                model.validTo != ''
                  ? new Date(model.validTo).toDateString()
                  : ''
              }
              placeholder="Valid To"
              style={styles.input}
              selectionColor={Colors.red}
              editable={false}
            />
          </TouchableOpacity>
          {Platform.OS === 'ios' ?
            <DatePicker
              open={show === 'validTo'}
              date={model.validTo ? new Date(model.validTo) : new Date()}
              mode='date'
              is24Hour={false}
              modal
              onConfirm={(date) => { onChangeDate('validTo', date) }
              }
              onCancel={() => {
                handleShow('')
              }}
              minimumDate={new Date()}
            /> : show === 'validTo' && (
              <DateTimePicker
                testID="dateTimePicker"
                value={model.validTo ? new Date(model.validTo) : new Date()}
                mode='date'
                is24Hour={false}
                display="default"
                onChange={(event, date) => {
                  Platform.OS === "ios" ? onChangeDate('validTo', date) : event.type == 'set'
                    ? onChangeDate('validTo', date)
                    : handleShow('')
                }
                }
                minimumDate={
                  model.validFrom ? new Date(model.validFrom) : new Date()
                }
              />
            )}
          <FontAwesome
            name="calendar"
            onPress={() => handleShow('validTo')}
            color={Colors.blue}
            style={styles.calendarIcon}
            size={20}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Thumbnail</Text>
          <TouchableOpacity onPress={() => selectImage('image')}>
            <TextInput
              style={styles.input}
              value={
                model.image
                  ? '...' +
                  model.image.name.substring(
                    model.image.name.length - 15,
                    model.image.name.length,
                  )
                  : ''
              }
              editable={false}
              placeholder="Thumbnail"
            />
            <Text style={styles.imgInputLabel}>Choose Image</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Type</Text>
          <RadioButton.Group
            value={model.type}
            onValueChange={val => handleInput('type', val)}>
            <View style={styles.radioBtnItemContainer}>
              <View style={styles.radioBtnItemContainer}>
                <RadioButton.Android color={Colors.red} value={false} />
                <Text>General</Text>
              </View>
              <View style={styles.radioBtnItemContainer}>
                <RadioButton.Android color={Colors.red} value={true} />
                <Text>Special</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>
        {model.type === true && <Text style={{ color: Colors.red }}>
          Click on the <FontAwesome name="users" /> icon after adding discount to assign special discount users
        </Text>}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Facility Base</Text>
          <RadioButton.Group
            value={model.base}
            onValueChange={val => handleInput('base', val)}>
            <View style={styles.radioBtnItemContainer}>
              <View style={styles.radioBtnItemContainer}>
                <RadioButton.Android color={Colors.red} value={true} />
                <Text>Yes</Text>
              </View>
              <View style={styles.radioBtnItemContainer}>
                <RadioButton.Android color={Colors.red} value={false} />
                <Text>No</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>
        {model.base === true && editing === false ?
          <ScrollView horizontal scrollEnabled={false}>
            <DiscountFacility addNew={true} discountFacility={discountFacility} handleFacilityCheckBox={handleFacilityCheckBox} />
          </ScrollView> : null}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fix Day</Text>
          <RadioButton.Group
            value={model.fixDay}
            onValueChange={val => handleInput('fixDay', val)}>
            <View style={styles.radioBtnItemContainer}>
              <View style={styles.radioBtnItemContainer}>
                <RadioButton.Android color={Colors.red} value={true} />
                <Text>Yes</Text>
              </View>
              <View style={styles.radioBtnItemContainer}>
                <RadioButton.Android color={Colors.red} value={false} />
                <Text>No</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>
        {model.fixDay ? (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fix Date*</Text>
            <TouchableOpacity onPress={() => handleShow('fixDate')}>
              <TextInput
                value={
                  model.fixDate != ''
                    ? new Date(model.fixDate).toDateString()
                    : ''
                }
                placeholder="Valid From"
                style={styles.input}
                selectionColor={Colors.red}
                editable={false}
              />
            </TouchableOpacity>
            {Platform.OS === 'ios' ?
              <DatePicker
                open={show === 'fixDate'}
                date={model.fixDate ? new Date(model.fixDate) : new Date()}
                mode='date'
                is24Hour={false}
                modal
                onConfirm={(date) =>
                  onChangeDate('fixDate', date)
                }
                onCancel={() => {
                  handleShow('')
                }}
                minimumDate={new Date()}
              /> :
              show === 'fixDate' && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={model.fixDate ? new Date(model.fixDate) : new Date()}
                  mode={new Date()}
                  is24Hour={false}
                  display="default"
                  onChange={(event, date) =>
                    Platform.OS === "ios" ? onChangeDate('fixDate', date) : event.type == 'set'
                      ? onChangeDate('fixDate', date)
                      : handleShow('')
                  }
                  minimumDate={new Date()}
                />
              )}
            <FontAwesome
              name="calendar"
              onPress={() => handleShow('fixDate')}
              color={Colors.blue}
              style={styles.calendarIcon}
              size={20}
            />
          </View>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Week Day</Text>
              <View style={styles.radioBtnItemContainer}>
                <Checkbox.Android
                  color={Colors.red}
                  status={model.weekDay ? 'checked' : 'unchecked'}
                  onPress={() => handleInput('weekDay', !model.weekDay)}
                />
                <Text>Week Day</Text>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>WeekEnd Day</Text>
              <View style={styles.radioBtnItemContainer}>
                <Checkbox.Android
                  color={Colors.red}
                  status={model.weekEndDay ? 'checked' : 'unchecked'}
                  onPress={() => handleInput('weekEndDay', !model.weekEndDay)}
                />
                <Text>WeekEnd Day</Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.btnContainer}>
          <Button
            color={Colors.black}
            style={styles.btn}
            labelStyle={styles.btnLabel}
            onPress={handleSubmit}>
            {editing ? 'Update Offer' : 'Add New Offer'}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddUpdateDiscount;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  inputContainer: {
    marginVertical: 10,
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
  radioBtnItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
  },
  imgInputLabel: {
    position: 'absolute',
    right: 0,
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 5,
    borderBottomEndRadius: 5,
    borderLeftColor: Colors.gray,
    borderLeftWidth: 1,
    top: 0,
    textAlignVertical: 'center',
    backgroundColor: '#c1c1c1',
    height: Platform.OS === 'ios' ? 50 : 40,
  },
  btnContainer: {
    padding: 10,
  },
  btn: {
    backgroundColor: Colors.blue,
  },
  btnLabel: {
    color: 'white',
  },
});
