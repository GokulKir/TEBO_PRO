import axios from 'axios';
import React, {useState} from 'react';
import apiInstance from '../api/apiInstance';

const useApi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (url, postData) => {
    setError(null);
    setIsLoading(true);

    try {
      const responce = await axios.post(url, postData);
      setData(responce);
      console.log('Response data: ' + responce);
    } catch (error) {
      setError(error);

      console.log('Fetching data error: ' + error.message);
    }

    setIsLoading(false);
  };

  return {
    data,
    error,
    isLoading,
    fetchData,
  };
};

export default useApi;
