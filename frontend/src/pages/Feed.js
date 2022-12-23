import { useEffect, useState } from 'react';
import io from 'socket.io-client';

import api from '../services/api';

import './Feed.css';

import more from '../assets/more.svg';
import like from '../assets/like.svg';
import comment from '../assets/comment.svg';
import send from '../assets/send.svg';

const Feed = () => {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const registerToSocket = () => {
      const socket = io('http://localhost:3333');

      socket.on('post', (newPost) => {
        setFeed((prevFeed) => [newPost, ...prevFeed]);
      });

      socket.on('like', (likedPost) => {
        setFeed((prevFeed) => {
          feed.map((post) => (post._id === likedPost._id ? likedPost : post));
        });
      });
    };

    const getPosts = async () => {
      await api.get('posts').then((response) => {
        setFeed(response.data);
      });
    };

    registerToSocket();
    getPosts();
  }, [feed]);

  const handleLike = (id) => {
    api.post(`/posts/${id}/like`);
  };

  return (
    <section id="post-list">
      {feed.map((post) => (
        <article key={post._id}>
          <header>
            <div className="user-info">
              <span>{post.author}</span>
              <span className="place">{post.place}</span>
            </div>
            <img src={more} alt="Mais" />
          </header>
          <img src={`http://localhost:3333/files/${post.image}`} alt="" />
          <footer>
            <div className="actions">
              <button type="button" onClick={() => handleLike(post._id)}>
                <img src={like} alt=""></img>
              </button>
              <img src={comment} alt=""></img>
              <img src={send} alt=""></img>
            </div>
            <strong>{post.likes} curtidas</strong>
            <p>
              {post.description}
              <span>{post.hashtags}</span>
            </p>
          </footer>
        </article>
      ))}
    </section>
  );
};

export default Feed;
