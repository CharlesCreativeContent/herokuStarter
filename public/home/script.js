document.querySelector("button").addEventListener("click", function () {
  const url = "/add";
  // axios
  //   .post(url, {
  //     url: window.location.href,
  //     name: document.querySelectorAll("span.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0")[10].innerHTML,
  //     img: document.querySelectorAll("img.css-9pa8cd")[1].src,
  //     followers: document.querySelectorAll("span.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0")[32].innerHTML,
  //   })

  // "url": "${url}","name": "${name}","img": "${img}","followers": "${followers}"
  // fetch("http://localhost:8080/add", {"method": "POST","mode": "no-cors","body": {"url": "${url}","name": "${name}","img": "${img}","followers": "${followers}",},}).then((x) => console.log(x.json()));
  axios
    .post(url, {
      url: "${url}",
      name: "${name}",
      img: "${img}",
      followers: "70",
    })
    .then(
      (response) => console.log(response),
      (error) => console.log(error)
    );
});
