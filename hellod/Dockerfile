FROM rust as build
WORKDIR /build
COPY Cargo.toml  .
COPY src src
RUN cargo build --release
RUN strip target/release/hellod

RUN mkdir /dependencies
RUN ldd target/release/hellod | awk '$1 ~ /^\// {print $1} $2 == "=>" {print $3}' | xargs tar hc | tar xC /dependencies

FROM scratch
COPY --from=build /dependencies /
COPY --from=build /build/target/release/hellod /
ENTRYPOINT ["/hellod"]
EXPOSE 1234/udp
