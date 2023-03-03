// import { setActivePinia, createPinia } from 'pinia';
import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import SongItem from '@/components/SongItem.vue';
// import Player from '@/components/Player.vue';

describe('Snapshots SongItem.vue', () => {
  test('renders correctly', () => {
    const song = {
      docID: 'abc',
      modifiedName: 'test',
      displayName: 'test',
      commentCount: 5
    };

    const wrapper = shallowMount(SongItem, {
      props: { song },
      global: {
        components: {
          'router-link': RouterLinkStub
        }
      }
    });

    expect(wrapper.element).toMatchSnapshot();
  });
});

// describe('Snapshots Player.vue', () => {
//   beforeEach(() => {
//     setActivePinia(createPinia());
//   });

//   test('renders correctly', () => {
//     const wrapper = shallowMount(Player);

//     expect(wrapper.element).toMatchSnapshot();
//   });
// });
