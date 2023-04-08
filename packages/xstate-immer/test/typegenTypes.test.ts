import { createMachine, TypegenMeta } from 'xstate';
import { assign } from '../src';

describe('@xstate/immer', () => {
  it('should infer an action object with narrowed event type', () => {
    interface TypesMeta extends TypegenMeta {
      eventsCausingActions: {
        doSomething: 'update';
      };
    }

    createMachine({
      tsTypes: {} as TypesMeta,
      context: {
        count: 0
      },
      schema: {
        context: {} as { count: number },
        events: {} as
          | {
              type: 'TOGGLE';
            }
          | {
              type: 'update';
              data: { count: number };
            }
      }
    }).provide({
      actions: {
        doSomething: assign(({ context, event }) => {
          ((_accept: 'update') => {})(event.type);
          // no error
          context.count += event.data.count;
          // @ts-expect-error
          ((_accept: "test that this isn't any") => {})(event);
          // @ts-expect-error
          ((_accept: "test that this isn't any") => {})(event.data);
        })
      }
    });
  });
});
