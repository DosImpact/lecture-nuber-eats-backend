// @Inject key 값 정의
export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
export const PUB_SUB = 'PUB_SUB';

// pubsub key 값 정의
export const NEW_PENDING_ORDER = 'NEW_PENDING_ORDER'; // 주문이 생성되면 owner는 통보받음
export const NEW_COOKED_ORDER = 'NEW_COOKED_ORDER'; // 음식이 update (요리완료) delivery는 이 사실을 알아야 한다.( 모든 배달원이 알아야함 )
export const NEW_ORDER_UPDATE = 'NEW_ORDER_UPDATE'; // 고객은 모든 요리 정보가 업데이트 되는 과정을 볼 수 있어야한다. ( 모든 사람이 하나의 주문에대해 update정보를 리슨가능 )
