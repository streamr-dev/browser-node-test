import { render, screen } from '@testing-library/react';
import App from './App';

test('renders id', () => {
  render(<App id={"testId"}/>);
  const linkElement = screen.getByText('testId');
  expect(linkElement).toBeInTheDocument()
})

test('renders msgs', () => {
  render(<App msgs={["msg 1", "msg 2", "msg 3"]}/>)
  const msg1 = screen.getByText("msg 1")
  const msg2 = screen.getByText("msg 2")
  const msg3 = screen.getByText("msg 3")
  expect(msg1).toBeInTheDocument()
  expect(msg2).toBeInTheDocument()
  expect(msg3).toBeInTheDocument()
})

test('renders connections', () => {
  render(<App connections={{ "conn1": 0, "conn2": 0, "conn3": 0 }}/>)
  const conn1 = screen.getByText("conn1")
  const conn2 = screen.getByText("conn2")
  const conn3 = screen.getByText("conn3")
  expect(conn1).toBeInTheDocument()
  expect(conn2).toBeInTheDocument()
  expect(conn3).toBeInTheDocument()
})

