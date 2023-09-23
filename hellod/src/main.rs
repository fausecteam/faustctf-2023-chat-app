fn main() {
    let s = std::net::UdpSocket::bind("[::]:1234").unwrap();
    let mut msg = [0; 1500];
    loop {
        if let Ok((_, peer)) = s.recv_from(&mut msg) {
            drop(s.send_to("Hello, world!\n".as_bytes(), peer));
        }
    }
}
