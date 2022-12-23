import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';

import './New.css';

const New = (props) => {
  const [postInfo, setPostInfo] = useState({
    image: null,
    author: '',
    place: '',
    description: '',
    hashtags: '',
  });

  const navigate = useNavigate();

  const handleImageChange = (event) => {
    setPostInfo((prevPostInfo) => ({
      ...prevPostInfo,
      image: event.target.files[0],
    }));
  };

  const handleChange = (event) => {
    setPostInfo((prevPostInfo) => ({
      ...prevPostInfo,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();

    data.append('image', postInfo.image);
    data.append('author', postInfo.author);
    data.append('place', postInfo.place);
    data.append('description', postInfo.description);
    data.append('hashtags', postInfo.hashtags);

    await api.post('posts', data);

    navigate('/');
  };

  return (
    <form id="new-post" onSubmit={handleSubmit}>
      <input type="file" onChange={handleImageChange} />
      <input
        type="text"
        name="author"
        placeholder="Autor do post"
        onChange={handleChange}
        value={postInfo.author}
      />
      <input
        type="text"
        name="place"
        placeholder="Local do post"
        onChange={handleChange}
        value={postInfo.place}
      />
      <input
        type="text"
        name="description"
        placeholder="Descrição do post"
        onChange={handleChange}
        value={postInfo.description}
      />
      <input
        type="text"
        name="hashtags"
        placeholder="Hashtags do post"
        onChange={handleChange}
        value={postInfo.hashtags}
      />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default New;
