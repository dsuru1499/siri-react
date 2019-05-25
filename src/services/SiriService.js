import * as Xml from "./Xml";

export default class SiriService {

  fetch(doc) {
    let url = this.getUrl();
    let body = Xml.toString(doc);

    return fetch(url, { method: "POST", headers: { "Content-Type": "text/xml" }, mode: "cors", body: body })
      .then(response => {
        if (response.ok) {
          return response.text();
        }
      })
      .then(text => Xml.fromString(text))
      .catch(this.onError);
  }

  onError(error) {
    console.log(error);
  }

  getDocument(option) {
    throw new Error('You must implement this function');
  };

  getUrl() {
    return (process.env.NODE_ENV !== "production") ? "http://127.0.0.1:8080/siri" : "/siri";
  }
}
