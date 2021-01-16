// @Inject key 값 정의
export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
export const PUB_SUB = 'PUB_SUB';

// pubsub key 값 정의
export const NEW_PENDING_ORDER = 'NEW_PENDING_ORDER'; // 주문이 생성되면 owner는 통보받음
export const NEW_COOKED_ORDER = 'NEW_COOKED_ORDER'; // 음식이 update (요리완료) delivery는 이 사실을 알아야 한다.( 모든 배달원이 알아야함 )
