// connect to Moralis server
Moralis.initialize("aYe2UDCqRqgpINaRgIRTV8MGhilipR5TfSlWL2Cr");
Moralis.serverURL = "https://6nfrimixgufy.usemoralis.com:2053/server";

// add from here down
async function login() {
  let user = Moralis.User.current();
  if (!user) {
    user = await Moralis.Web3.authenticate();
  }
  console.log("logged in user:", user);
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out of wallet");
}

const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const chatId = params.get('id')
  console.log(chatId)

  async function init(){
    let query = new Moralis.Query('Message');
    let subscription = await query.subscribe();

    const historyList = document.getElementById("historyList");

    subscription.on('create', (object) => {
      if(object.get("group") == chatId){
        var listItem = document.createElement('li');
        listItem.innerHTML = object.get("sender") + " says:<br>"+object.get("text")+"<br>"
        historyList.appendChild(listItem);
      }
    });
  }



  async function getHistory(){
    const Message = Moralis.Object.extend("Message");
    const query = new Moralis.Query(Message);
    query.equalTo("group",chatId)
    const results = await query.find();

    const historyList = document.getElementById("historyList");

    for (let i = 0; i < results.length; i++) {
      const object = results[i];
      var listItem = document.createElement('li');
      listItem.innerHTML = object.get("sender") + " says:<br>"+object.get("text")+"<br>"
      historyList.appendChild(listItem);
    }

  }

  init()
  getHistory()


  async function sendMessage(){
    let user = Moralis.User.current();
    let message =  document.getElementById("chatInput").value;

    if(message && message.length>0){
      const Message = Moralis.Object.extend("Message");
      const m = new Message();
      m.set("sender",user.get("ethAddress"))
      m.set("text",message)
      m.set("group",chatId)

      m.save()

      console.log("sending " + message + " from " + user.get("ethAddress") + " in group " + chatId)
    }
  }

  document.getElementById("sendButton").onclick = sendMessage;

