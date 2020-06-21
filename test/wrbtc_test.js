const WRBTC = artifacts.require('./WRBTC');

const BN = web3.utils.BN;
contract('Bridge_v1', async function (accounts) {
    const tokenOwner = accounts[0];
    const anAccount = accounts[1];
    const anotherAccount = accounts[2];

    beforeEach(async function () {
        this.wrbtc = await WRBTC.new();
    });

    describe('Deposit', async function () {
        it('should deposit RBTC and obtain WRBTC', async function () {
            const amount = new BN(web3.utils.toWei("1"));
            const balance = new BN(await web3.eth.getBalance(anAccount));

            await this.wrbtc.deposit({from: anAccount, value: amount});

            let result = new BN(await this.wrbtc.balanceOf(anAccount));
            assert.equal(result.toString(), amount.toString());
            result = new BN(await this.wrbtc.totalSupply());
            assert.equal(result.toString(), amount.toString());
            const newBalance = new BN(await web3.eth.getBalance(anAccount));
            assert.equal(newBalance < balance.sub(amount), true);
        });

        it('should send RBTC and obtain WRBTC', async function () {
            const amount = new BN(web3.utils.toWei("1"));
            const balance = new BN(await web3.eth.getBalance(anAccount));
            const wrbtcBalance = new BN(await this.wrbtc.balanceOf(anAccount));

            await web3.eth.sendTransaction({
                from: anAccount,
                to: this.wrbtc.address,
                value: amount
            })

            let result = new BN(await this.wrbtc.balanceOf(anAccount));
            assert.equal(result.toString(), amount.toString());
            result = new BN(await this.wrbtc.totalSupply());
            assert.equal(result.toString(), amount.toString());
            const newBalance = new BN(await web3.eth.getBalance(anAccount));
            assert.equal(newBalance < balance.sub(amount), true);
        });

    });

    describe('Whithdraw', async function () {
        it('should send WRBTC and obtain RBTC', async function () {
            const amount = new BN(web3.utils.toWei("1"));
            await this.wrbtc.deposit({from: anAccount, value: amount});
            const balance = new BN(await web3.eth.getBalance(anAccount));

            await this.wrbtc.withdraw(amount, {from: anAccount});

            let result = new BN(await this.wrbtc.balanceOf(anAccount));
            assert.equal(result.toString(), '0');
            const newBalance = new BN(await web3.eth.getBalance(anAccount));
            assert.equal(newBalance > balance, true);
        });

    });

    describe('Transfer', async function () {
        it('should transfer WRBTC', async function () {
            const amount = new BN(web3.utils.toWei("1"));
            await this.wrbtc.deposit({from: anAccount, value: amount});

            await this.wrbtc.transfer(anotherAccount, amount, {from: anAccount});

            let result = new BN(await this.wrbtc.balanceOf(anotherAccount));
            assert.equal(result.toString(), amount.toString());
            result = new BN(await this.wrbtc.balanceOf(anAccount));
            assert.equal(result.toString(), '0');
            result = new BN(await this.wrbtc.totalSupply());
            assert.equal(result.toString(), amount.toString());
        });

        it('should aprove and transferFrom WRBTC', async function () {
            const amount = new BN(web3.utils.toWei("1"));
            await this.wrbtc.deposit({from: anAccount, value: amount});

            await this.wrbtc.approve(tokenOwner, amount, {from: anAccount});
            await this.wrbtc.transferFrom(anAccount, anotherAccount,amount, {from: tokenOwner});

            let result = new BN(await this.wrbtc.balanceOf(anotherAccount));
            assert.equal(result.toString(), amount.toString());
            result = new BN(await this.wrbtc.balanceOf(anAccount));
            assert.equal(result.toString(), '0');
            result = new BN(await this.wrbtc.totalSupply());
            assert.equal(result.toString(), amount.toString());
        });

    });

});
