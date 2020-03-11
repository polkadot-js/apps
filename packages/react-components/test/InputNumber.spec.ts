import { formatInput } from '../src/InputNumber';

describe('Test formatting', () => {
  it('Check number format for 012:', done => {
    const value = '012';
    const formatted = formatInput(value);
    expect(formatted).toEqual('12');
    done();
  });

  it('Check number format for 0.12:', done => {
    const value = '0.12';
    const formatted = formatInput(value);
    expect(formatted).toEqual('0.12');
    done();
  });

  it('Check number format for 1234:', done => {
    const value = '1234';
    const formatted = formatInput(value);
    expect(formatted).toEqual('1,234');
    done();
  });

  it('Check number format for 0012:', done => {
    const value = '0012';
    const formatted = formatInput(value);
    expect(formatted).toEqual('12');
    done();
  });

  it('Check number format for 1234.0:', done => {
    const value = '1234.0';
    const formatted = formatInput(value);
    expect(formatted).toEqual('1,234.0');
    done();
  });

  it('Check number format for 0.:', done => {
    const value = '0.';
    const formatted = formatInput(value);
    expect(formatted).toEqual('0.');
    done();
  });

  it('Check number format for 0.0:', done => {
    const value = '0.0';
    const formatted = formatInput(value);
    expect(formatted).toEqual('0.0');
    done();
  });

  it('Check number format for .:', done => {
    const value = '.';
    const formatted = formatInput(value);
    expect(formatted).toEqual('0.');
    done();
  });


  it('Check number format for 0.10:', done => {
    const value = '0.10';
    const formatted = formatInput(value);
    expect(formatted).toEqual('0.10');
    done();
  });
});
