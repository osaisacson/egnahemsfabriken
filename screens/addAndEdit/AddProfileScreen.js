import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, TextInput } from 'react-native';
import FormWrapper from '../../components/wrappers/FormWrapper';
import {
  FormFieldWrapper,
  formStyles
} from '../../components/wrappers/FormFieldWrapper';
import ImagePicker from '../../components/UI/ImgPicker';
//Actions
import * as profilesActions from '../../store/actions/profiles';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value // From textChangeHandler = (inputIdentifier, text)
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const AddProfileScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //Get profiles, return only the one which matches the logged in id
  const loggedInUserId = useSelector(state => state.auth.userId);
  const profilesArray = useSelector(state => state.profiles.allProfiles).filter(
    profile => profile.profileId === loggedInUserId
  );

  const firebaseId = props.route.params ? props.route.params.detailId : null;

  //Currently edited profile
  const currentProfile = profilesArray[0];

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      profileName: currentProfile ? currentProfile.profileName : '',
      email: currentProfile ? currentProfile.email : '',
      phone: currentProfile ? currentProfile.phone : '',
      address: currentProfile ? currentProfile.address : '',
      image: currentProfile ? currentProfile.image : ''
    },
    inputValidities: {
      profileName: currentProfile ? true : false,
      email: currentProfile ? true : false,
      phone: currentProfile ? true : false,
      address: currentProfile ? true : false,
      image: currentProfile ? true : false
    },
    formIsValid: currentProfile ? true : false
  });

  //Handlers
  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert(
        'Något är felskrivet!',
        'Kolla om det står någon text under något av fälten.',
        [{ text: 'Ok' }]
      );
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (currentProfile) {
        await dispatch(
          profilesActions.updateProfile(
            firebaseId,
            formState.inputValues.profileName,
            formState.inputValues.email,
            formState.inputValues.phone,
            formState.inputValues.address,
            formState.inputValues.image
          )
        );
      } else {
        await dispatch(
          profilesActions.createProfile(
            formState.inputValues.profileName,
            formState.inputValues.email,
            formState.inputValues.phone,
            formState.inputValues.address,
            formState.inputValues.image
          )
        );
      }
      props.navigation.navigate('BottomTabs');
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, currentProfile, formState]);

  //Manages validation of title input
  const textChangeHandler = (inputIdentifier, text) => {
    //inputIdentifier and text will act as key:value in the form reducer

    let isValid = true;

    //If we haven't entered any value (its empty) set form validity to false
    if (text.trim().length === 0) {
      isValid = false;
    }

    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: text,
      isValid: isValid,
      input: inputIdentifier
    });
  };

  //Alert if error
  useEffect(() => {
    if (error) {
      Alert.alert('Oj!', error, [{ text: 'OK' }]);
    }
  }, [error]);

  useEffect(() => {
    if (isLoading) {
      Alert.alert(
        'Laddar upp din profil, ändringarna syns om några sekunder',
        error,
        [{ text: 'OK' }]
      );
    }
  }, [isLoading]);

  return (
    <FormWrapper
      submitButtonText="Spara Profil"
      handlerForButtonSubmit={submitHandler}
      isLoading={isLoading}
    >
      <FormFieldWrapper
        label="Profil bild"
        showPromptIf={!formState.inputValues.image}
        prompt="Välj en profilbild"
      >
        <ImagePicker
          onImageTaken={textChangeHandler.bind(this, 'image')}
          passedImage={formState.inputValues.image}
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        label="Användarnamn"
        showPromptIf={!formState.inputValues.profileName}
        prompt="Skriv in ett användarnamn"
      >
        <TextInput
          style={formStyles.input}
          value={formState.inputValues.profileName}
          onChangeText={textChangeHandler.bind(this, 'profileName')}
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        label="Telefon"
        showPromptIf={!formState.inputValues.phone}
        prompt="Lägg in ett kontaktnummer"
      >
        <TextInput
          style={formStyles.input}
          value={formState.inputValues.phone.toString()}
          onChangeText={textChangeHandler.bind(this, 'phone')}
          keyboardType="number-pad"
          autoCorrect={false}
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        label="Email"
        showPromptIf={!formState.inputValues.email}
        prompt="Skriv in den email folk kan kontakta dig på"
      >
        <TextInput
          style={formStyles.input}
          value={formState.inputValues.email}
          onChangeText={textChangeHandler.bind(this, 'email')}
          keyboardType="email-address"
          required
          email
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        label="Address"
        showPromptIf={!formState.inputValues.profileName}
        prompt="Skriv in addressen återbruket vanligtvis kan hämtas på"
      >
        <TextInput
          style={formStyles.input}
          value={formState.inputValues.address}
          onChangeText={textChangeHandler.bind(this, 'address')}
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
        />
      </FormFieldWrapper>
    </FormWrapper>
  );
};

export const screenOptions = navData => {
  return {
    headerLeft: '',
    headerTitle: 'Skapa profil',
    headerRight: ''
  };
};

export default AddProfileScreen;