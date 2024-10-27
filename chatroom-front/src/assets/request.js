import axios from 'axios';

export const Address = 'http://localhost:3000';

// 定义 HTTP 方法常量
export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

// 通用请求函数
export const fetchData = async (url, method, data = null) => {
  var p;
  if (method === HttpMethod.GET) {
    p = doGet(url);
  }
  else if (method === HttpMethod.POST) {
    p = doPost(url, data);
  }
  return p;
};

const doGet = async (url) => {
  return await axios.get(url);
}
const doPost = async (url, data) => {
  return await axios.post(url, data);
}


