package io;

import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Mono;

public class ReactiveWebSocketHandler  implements WebSocketHandler {
    @Override
    public Mono<Void> handle(WebSocketSession session) {

        return null;
    }
}
