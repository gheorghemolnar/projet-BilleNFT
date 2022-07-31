function Link({ uri, text }) {
  return <a href={uri} target="_blank" rel="noreferrer">{text}</a>;
}

function Footer() {
  return (
    <footer>
      <h2> ___ TO DO ___</h2>
      <Link uri={"https://web3.corsica.com"} text={"Link 01 "} />
      <Link uri={"https://web3.corsica.com"} text={"Link 02 "} />
      <Link uri={"https://web3.corsica.com"} text={"Link 03 "} />
    </footer >
  );
}

export default Footer;
