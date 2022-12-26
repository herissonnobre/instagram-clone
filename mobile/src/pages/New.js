import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

const New = () => {
  const navigation = useNavigation();

  const [postInfo, setPostInfo] = useState({
    preview: null,
    image: null,
    author: '',
    place: '',
    description: '',
    hashtags: '',
  });

  const handleSelectImage = () => {
    launchImageLibrary({ includeBase64: true }, response => {
      if (response.errorCode) {
        console.log('Error');
      } else if (response.didCancel) {
        console.log('User canceled');
      } else {
        const preview = {
          uri: `data:image/jpg;base64,${response.assets[0].base64}`,
        };

        let prefix;
        let ext;

        if (response.assets[0].fileName) {
          [prefix, ext] = response.assets[0].fileName.split('.');

          ext = ext.toLowerCase() === 'heic' ? 'jpg' : ext;
        } else {
          prefix = new Date().getTime();
          ext = 'jpg';
        }

        const image = {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: `${prefix}.${ext}`,
        };

        setPostInfo({
          ...postInfo,
          preview: preview,
          image: image,
        });
      }
    });
  };

  const handleSubmit = async event => {
    const data = new FormData();

    data.append('image', postInfo.image);
    data.append('author', postInfo.author);
    data.append('place', postInfo.place);
    data.append('description', postInfo.description);
    data.append('hashtags', postInfo.hashtags);

    console.log(data);

    await api
      .post('posts', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(navigation.navigate('Feed'))
      .catch(error => console.log(error));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selectButton} onPress={handleSelectImage}>
        <Text style={styles.selectButtonText}>Selecionar imagem</Text>
      </TouchableOpacity>
      {postInfo.preview && (
        <Image style={styles.preview} source={postInfo.preview} />
      )}
      <TextInput
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="Nome do autor"
        placeholderTextColor="#999"
        value={postInfo.author}
        onChangeText={author =>
          setPostInfo({
            ...postInfo,
            author: author,
          })
        }
      />
      <TextInput
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="Local da foto"
        placeholderTextColor="#999"
        value={postInfo.place}
        onChangeText={place =>
          setPostInfo({
            ...postInfo,
            place: place,
          })
        }
      />
      <TextInput
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="Descrição"
        placeholderTextColor="#999"
        value={postInfo.description}
        onChangeText={description =>
          setPostInfo({
            ...postInfo,
            description: description,
          })
        }
      />
      <TextInput
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="Hashtags"
        placeholderTextColor="#999"
        value={postInfo.hashtags}
        onChangeText={hashtags =>
          setPostInfo({
            ...postInfo,
            hashtags: hashtags,
          })
        }
      />
      <TouchableOpacity style={styles.shareButton} onPress={handleSubmit}>
        <Text style={styles.shareButtonText}>Compartilhar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  selectButton: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
    height: 42,

    justifyContent: 'center',
    alignItems: 'center',
  },

  selectButtonText: {
    fontSize: 16,
    color: '#666',
  },

  preview: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 4,
  },

  input: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginTop: 10,
    fontSize: 16,
  },

  shareButton: {
    backgroundColor: '#7159c1',
    borderRadius: 4,
    height: 42,
    marginTop: 15,

    justifyContent: 'center',
    alignItems: 'center',
  },

  shareButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  },
});

export default New;
