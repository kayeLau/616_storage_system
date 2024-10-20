const app = require('./src/index');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

describe('API Tests', () => {
    describe('POST /order/greet', () => {
        it('should return a greeting message', (done) => {
            chai.request(app)
                .get('/api/greet')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Hello, World!');
                    done();
                });
        });
    });
});