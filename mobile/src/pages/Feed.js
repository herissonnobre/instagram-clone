import {
  Image,
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import api from '../services/api';

import more from '../assets/more.png';
import like from '../assets/like.png';
import comment from '../assets/comment.png';
import send from '../assets/send.png';

const Feed = () => {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const registerToSocket = () => {
      const socket = io('http://10.0.2.2:3333');

      socket.on('post', newPost => {
        setFeed(prevFeed => [newPost, ...prevFeed]);
      });

      socket.on('like', likedPost => {
        setFeed(prevFeed => {
          return feed.map(post =>
            post._id === likedPost._id ? likedPost : post,
          );
        });
      });
    };

    const getPosts = async () => {
      await api
        .get('posts')
        .then(response => {
          setFeed(response.data);
        })
        .catch(error => console.log(error));
    };

    registerToSocket();
    getPosts();
  }, [feed]);

  const handleLike = id => {
    api.post(`/posts/${id}/like`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={feed}
        keyExtractor={post => post._id}
        renderItem={({ item }) => (
          <View styles={styles.feedItem}>
            <View style={styles.feedItemHeader}>
              <View style={styles.userInfo}>
                <Text style={styles.name}>{item.author}</Text>
                <Text style={styles.place}>{item.place}</Text>
              </View>
              <Image source={more} />
            </View>
            <Image
              style={styles.feedImage}
              source={{ uri: `http://10.0.2.2:3333/files/${item.image}` }}
            />

            <View style={styles.feedItemFooter}>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.action}
                  onPress={() => handleLike(item._id)}>
                  <Image source={like} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.action} onPress={() => {}}>
                  <Image source={comment} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.action} onPress={() => {}}>
                  <Image source={send} />
                </TouchableOpacity>
              </View>
              <Text style={styles.likes}>{item.likes} curtidas</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.hashtags}>{item.hashtags}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  feedItem: {
    marginTop: 20,
  },
  feedItemHeader: {
    paddingHorizontal: 15,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    color: '#000',
  },
  place: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  feedImage: {
    width: '100%',
    height: 400,
    marginVertical: 15,
  },
  feedItemFooter: {
    paddingHorizontal: 15,
  },
  actions: {
    flexDirection: 'row',
  },
  action: {
    marginRight: 8,
  },
  likes: {
    marginTop: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    lineHeight: 18,
    color: '#000',
  },
  hashtags: {
    color: '#7159c1',
  },
});

export default Feed;
