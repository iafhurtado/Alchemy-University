const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "044033a92c1c8e4631b5e96f60f75f071c048f909dcab90eb672e33933347c8dcd35f8c35d59a940356577850068c471021d3a5a46163cfeda497595d3f71ee741": 100,
  "048e6d520fe42f6233998bdb70666b9744380277ec90ad19d43861a6fdf5b9aae9c8794517344d6def4129686f0aab660c5ea6f53d56e83f92a2ebc17013e43483": 500,
  "040caf80c945e8876f4b2c03de12faa7428aa9ee82e8e4e757594e979eb399979616d92c201a94879c226e2ef96686fc8fc1c1cb475c7023218caa81f89d23af2b": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
