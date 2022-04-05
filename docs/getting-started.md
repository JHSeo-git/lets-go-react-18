---
title: 'getting-started'
date: '2022-03-30'
---

# Initialize React 18 기능 체험용 프로젝트

React 18이 정식으로 Release 되었고 많은 기능들이 소개되었습니다.

그 기능들을 직접 비교 체험해보면서 느껴보려고 합니다.

새로운 릴리즈이기 때문에 제일 잘 이뤄질 것 같은 webpack + babel로 번들링을 구성해서 테스트해보겠습니다.

> React Concurrency 개념을 이해하기 위해 다음 링크를 이용하시길 강력하게 추천드립니다.  
> [Inside React - 동시성을 구현하는 기술](https://deview.kr/2021/sessions/518)  
> [발표자료](<https://deview.kr/data/deview/session/attach/1_Inside%20React%20(%E1%84%83%E1%85%A9%E1%86%BC%E1%84%89%E1%85%B5%E1%84%89%E1%85%A5%E1%86%BC%E1%84%8B%E1%85%B3%E1%86%AF%20%E1%84%80%E1%85%AE%E1%84%92%E1%85%A7%E1%86%AB%E1%84%92%E1%85%A1%E1%84%82%E1%85%B3%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%89%E1%85%AE%E1%86%AF).pdf>)

## new features

React 18 변화를 한 단어로 정리하자면 Concurrency 입니다.
대부분의 새로운 기능은 React에서 동시성을 제공하기 위한 기능입니다.

- [automatic batching](#automatic-batching)
- [transitions](#transitions)

## automatic batching

Batching은 React가 다수의 state를 가지고 있을 때 더 나은 성능을 위해 single re-render하도록 업데이트하는 것입니다.

promises, setTimeout, native event handlers, React에서 batch되지 않던 event들의 경우에 기존에는 각 state가 변경될 때마다 re-render가 일어났다면, react 18에서는 automatic batching으로 인해 `Batching`하여 자동으로 한 번만 re-render하도록 되었습니다.

```jsx
// Before: only React events were batched.
setTimeout(() => {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // React will render twice, once for each state update (no batching)
}, 1000);

// After: updates inside of timeouts, promises,
// native event handlers or any other event are batched.`
setTimeout(() => {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // React will only re-render once at the end (that's batching!)
}, 1000);
```

## transitions

![legacy-rendering](https://dmitripavlutin.com/118bc6d32d941ce629f1f18206fefc6f/legacy-4.svg)

![concurrent-rendering](https://dmitripavlutin.com/2539ba977c8a8880be97d01c03835a88/concurrent-4.svg)

- Urgent updates(긴급한 업데이트)은 타이핑, 클릭, 키입력과 같은 것들 바로 반응해야 하는 것들을 반영합니다.
- Transition updates(트랜지션 업데이트)은 하나의 view에서 또 다른 view로 UI를 전환합니다.

타이핑, 클릭, 키입력과 같은 Urgent Update는 물리적 객체가 어떻게 동작하는지에 대한 우리의 직관과 일치하도록 즉각적인 응답이 필요합니다. 그렇게 움직이지 않는다면 "잘못된" 느낌을 받습니다.
그러나 트랜지션은 사용자가 스크린에 트랜지션 중간의 모든 값을 볼 것으로 기대하지 않기 때문에 urgent update와 다릅니다.

예를 들어 dropdown에서 filter를 선택했을 때, filter 버튼이 당신이 클릭했을 때 즉각적으로 응답하길 기대할 것입니다. 그러나 실제 결과는 별도로 각각 전환될 수 있습니다. 약간의 딜레이는 감지할 수 없고 종종 예상됩니다. 그리고 만약 그 결과를 렌더링을 완료하기 전에 filter를 다시 바꾼다면 최신 결과만 볼 수 있습니다.

일반적으로 최상의 사용자 경험을 위해서는 단일 user input은 urgent update와 non-urgent update 모두 발생해야 합니다. input event 내에 startTransition API를 사용하면 어떤 update가 urgent한지, 어떤 것이 "transition"인지 React에게 알려줄 수 있습니다.

|    ![with](./images/with.png)    |
| :------------------------------: |
| **with transition** : concurrent |

| ![without](./images/without.png) |
| :------------------------------: |
| **without transition** : blocked |

transition을 사용했던 위 사진에서는 task가 잘게 쪼개져서 concurrent 하게 동작되는 것을 볼 수 있습니다.
그러나 transition이 없는 아래 사진은 long task가 block된 모습을 볼 수 있습니다. input에 타이핑을 하더라도 block으로 인해 화면에 렌더링되지 않은 이유입니다.

```jsx
import { startTransition } from 'react';

const handleInput = () => {
  // Urgent: Show what was typed
  setInputValue(input);

  // Mark any state updates inside as transitions
  startTransition(() => {
    // Transition: Show the results
    setSearchQuery(input);
  });
};
```

startTransition으로 감싸진 Update(setState)는 non-urgent(급하지 않은 것)으로 다뤄집니다.
만약 click이나 키입력과 같은 더 urgent(긴급한) 업데이트가 있다면 _interrupt_ 됩니다.

만약 사용자가 transition을 중단하면(예를 들어, 여러 문자를 연속으로 입력), React는 완료되지 않은 오래된 rendering 작업을 throw out(버림)하고 최신 업데이트만 렌더링합니다.
다시 말해, 다수의 글자를 입력할 때 렌더링을 기다렸던 중간 상태들은 버려지고 마지막 상태만 렌더링합니다.

- `useTransition`: transition을 시작하기 위한 pending 상태를 포함한 hook
- `startTransition`: hook이 사용되지 않을 때 transition을 시작하기 위한 method

transition은 concurrent rendering에서 해당 update를 중단할 수 있습니다. content가 re-suspend 상태가 된다면, transition은 백그라운드에서 trantition content를 렌더링하는 동안 현재 content를 계속 보여주도록 React에게 말합니다.

> Note:  
> transition에서 update는 클릭과 같은 보다 긴급한(urgent) update를 위해 중단합니다.  
> transition에서 update는 re-suspend된 content를 위해 fallback를 보여주지 않습니다.  
> update가 렌더링되는 동안에 사용자에게 현재 content와 계속해서 상호작용하도록 해줍니다.

기존에 렌더링 block이 한 묶음으로 이루어져 무거운 렌더링이 있을 경우 동시성 보장이 힘들었다면, useTransition을 통해 작업을 나누고 우선순위를 두어 동시성 문제를 해결합니다.

정리하자면 input에 값을 입력하는 것과 같은 urgent update는 즉각적으로 반응을 해야합니다.
그런데 heavy한 render로 인해 urgent update가 prevent 되는 경우가 발생한다면 이것은 UX에 안 좋은 영향을 줍니다. useTransition은 이러한 경우를 막기 위해 사용됩니다. non-urgent update를 startTransition으로 감싼다면 react는 '이것은 non-urgent update구나'라고 이해하고 render를 urgnet update보다 후순위로 미룹니다. 그래서 사람의 인지와 관련있는 urgent update를 더 빠르게 렌더링하여 더 나은 UX를 제공합니다.

### useTransition vs useDeferredValue

> react 18에서 공개된 useDeferredValue 라는 hook이 있습니다.  
> 동시성을 제공하기 위해서 사용되기에 useTransition과 얼핏 비슷해보이기도 합니다.  
> 저 또한 차이가 어떤 점에서 발생하는지 느낌으로만 알고 있는데 자세히 보기 위해 조금 살펴보았습니다.

useTransition은 위에도 살펴보았듯이 React에게 우선순위가 낮은 update를 알려주어 해당 non-urgent update를 urgent update 뒤로 rebase하게 해주는 역할을 합니다.

또한 useTransition은 어떤 코드를 낮은 우선순위로 다룰지, 어떤 코드를 wrapping할지 결정하도록 모든 권한을 줍니다.

```jsx
function App() {
  const [isPending, startTransition] = useTransition();
  const [filterTerm, setFilterTerm] = useState('');

  const filteredProducts = filterProducts(filterTerm);

  function updateFilterHandler(event) {
    startTransition(() => {
      setFilterTerm(event.target.value);
    });
  }

  return (
    <div id="app">
      <input type="text" onChange={updateFilterHandler} />
      {isPending && <p>Updating List...</p>}
      <ProductList products={filteredProducts} />
    </div>
  );
}
```

그러나 코드를 업데이트하는 실제 상태에 접근하지 못하는 경우가 있을 수 있습니다(예를 들어 third-party library에서 수행되는 경우 등). 또는 몇가지 이유로 인해 useTransition을 사용 못하게 될 수도 있습니다.

대신 그런 경우에 useDeferredValue를 사용할 수 있습니다.

useDeferredValue는 상태를 wrapping 하지 않습니다. 대신에 상태 업데이트 때문에 변경되거나 재생성된 value를 다룹니다(그 상태 그대로 쓰거나 또는 기본 상태에 computed 값).

```jsx
function ProductList({ products }) {
  const deferredProducts = useDeferredValue(products);
  return (
    <ul>
      {deferredProducts.map((product) => (
        <li>{product}</li>
      ))}
    </ul>
  );
}
```

**그래서 우리는 무엇을 써야합니까?**  
위에서 업급했듯이 useTransition은 상태 업데이트 코드를 wrapping하는 반면 useDeferredValue는 상태 업데이트의 영향을 받는 값(상태 그대로의 값 또는 상태에서 computed된 값)을 쓴다는 점입니다.

결국 둘 다 같은 목표를 달성하기 때문에 함께 사용할 필요는 없습니다.

더 낮은 우선순위로 처리해야 하는 상태 업데이트가 있고 상태 업데이트 코드에 접근할 수 있는 경우 useTransition을 사용하는 것이 더 좋습니다.
해당 코드에 접근 권한이 없다면 useDeferredValue를 사용하세요.

**반드시 써야할까요?**  
**모든** 상태 업데이트를 useTransition이나 useDeferredValue로 wrapping하지 마세요.
다른 수단으로 최적화할 수 없는 복잡한 UI나 component가 있을 때 이러한 hook을 사용해야 합니다.
lazy loading 사용, pagination 사용, worker thread에서 처리하는 것, backend 서버에서 처리하는 것 등으로 처리할 수 있는지를 항상 염두해 두어야 합니다.

## Suspense

Suspense는 아직 화면에 보여줄 준비가 되지 않은 경우에 component 트리의 일부에 대한 loading 상태를 선언적으로 지정할 수 있습니다.

```jsx
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

Suspense는 React 프로그래밍 모델에서 "UI loading 상태"를 first-class 선언적 개념으로 만듭니다.
(즉, `<Component>...</Component>` 형태로 쓸 수 있다는 말입니다.)

> fisrt-class(일급객체)  
> 다른 객체들에 일반적으로 적용 가능한 연산을 모두 지원하는 객체를 말합니다. 보통 함수에 인자로 넘기기, 수정하기, 변수에 대입하기와 같은 연산을 지원할 때 일급 객체라고 합니다.  
> 쉽게 말하면, 자바스크립트에서는 함수가 일급객체입니다. 리액트 선언적 개념으로 다루면 `<Component>` 형태로 쓸 수 있습니다.(`React.createElement(...)`와 동일하며 이 표현식은 명령형 개념입니다.)

이를 통해 더 높은 수준의 기능을 구축할 수 있습니다.

몇 년 전에 제한된 버전의 Suspense를 도입했습니다. 그러나 유일한 사용 사례는 React.lazy 코드 스플리팅에 사용된 경우였습니다. 서버에서 렌더링할 때는 전혀 지원되지 않았습니다.

React 18에서는 서버에서 Suspense에 대한 지원을 추가하고 Concurrent rendering 기능을 사용하여 기능을 확장했습니다.

Suspense는 transition API(useTransition, startTransition)와 함께 동작합니다.
transition하는 동안에 suspend(일시중지) 된다면 React는 이미 보이는(already-visible) 컨텐츠가 fallback으로 대체되는 것을 방지합니다. 대신 React는 잘못된 loading 상태를 막기 위해 data가 충분히 로드될 때까지 렌더링을 지연합니다.

### Streaming HTML and Selective Hydration

> https://github.com/reactwg/react-18/discussions/37  
> https://codesandbox.io/s/kind-sammet-j56ro?file=/src/App.js

React에서 SSR은 다음과 같은 방식으로 항상 진행됩니다.

1. 서버에서: App에 필요한 data를 fetch 합니다.
2. 서버에서: App을 HTML로 render하고 response로 보냅니다.
3. 클라이언트에서: App을 위한 JavaScript 코드를 로드합니다.
4. 클라이언트에서: 서버에서 생성된 HTML에 JavaScript 로직을 연결합니다.(이것을 "hydration"이라고 합니다.)

여기서 문제는 **다음 단계 시작 전에 각 단계가 전체 어플리케이션에 대한 작업을 한 번에 완료되어야 한다는 것입니다.** 앱의 거의 모든 부분이 non-trival인 경우, 앱의 일부가 다른 부분보다 느린 경우, 이런 경우는 효율적이지 않습니다.

| ![csr](./images/csr-only.png) |
| :---------------------------: |
|        1. CSR: 빈 HTML        |

SSR을 사용하지 않는 경우 JavaScript가 로드되는 동안 사용자에게 표시되는 것은 빈 페이지뿐입니다. 이것이 권장되지 않으며 인터넷 속도가 느린 경우(일반적으로 JavaScript 크기가 크기 때문에) 특히 더 심해집니다. 그래서 SSR을 사용하게 됩니다.

|    ![ssr-yet-hydration](./images/ssr-yet-hydration.png)    |
| :--------------------------------------------------------: |
| 2. SSR + hydration X: 서버에서 생성된 HTML, but 이벤트가 X |

SSR을 사용하여 React components를 HTML로 렌더링하여 사용자에게 보냅니다. 그러나 HTML은 매우 상호작용적이지 않습니다.(link, form, 등 간단한 built-in Web interactive 등 제외, 만약 build-in Web interactive로만 작성되었다면 이런 문제는 없습니다.) 하지만 장점으로는 JavaScript가 로드되는 동안(hydration) 사용자는 화면에 _무언가를 볼 수 있다는 것입니다._

위 사진에서 회색 표시는 완전히 상호작용하지 않는다는 것을 나타냅니다. 만약 그 부분에 상호작용이 필요한 JavaScript 코드가 있다면 이벤트를 호출(클릭과 같은)하더라도 아무 작업도 수행되지 않습니다.  
그러면 CSR과 차이가 없는거 아닐까요? JavaScript를 로드하는 시간은 CSR과 동일한데 SSR 시간이 추가가 된 거 아닌가요?

**그러나 특히 콘텐츠가 많은 웹 사이트의 경우 SSR은 JavaScript가 로드되는 동안 연결 상태가 좋지 않은 사용자가 콘텐츠를 읽거나 볼 수 있도록 하기 때문에 매우 유용합니다.**
또한 CSR과 달리 메모리에 컴포넌트 트리를 렌더링은 하지만 이에 대한 DOM 노드를 생성하는 대신 기존 HTML DOM 노드에 이벤트를 붙이는 형태로 작업됩니다. 이 작업을 hydration이라고 부릅니다. 건조한 HTML(SSR로 생성된 HTML)에 물을 주는 것과 같다고 해서 그렇습니다.

| ![ssr-with-hydration](./images/ssr%2Bhydration.png) |
| :-------------------------------------------------: |
| 3. SSR + hydration O: 서버에서 생성된 HTML + 이벤트 |

SSR은 일종의 "마술 트릭"입니다. 앱이 완전히 상호작용하는 속도가 빨라지지는 않습니다. 대신 비대화형(non-interactive) 버전의 앱을 더 빨리 표시할 수 있으므로 사용자는 JavaScript가 로드되기를 기다리는 동안 정적 콘텐츠를 볼 수 있습니다. 이것은 네트워크 연결상태가 좋지 않은 사람들에게 큰 차이를 만들고 전반적으로 인지적인 성능을 향상시킵니다. 또한 더 쉬운 인덱싱과 더 나은 속도 덕분에 SEO에도 도움이 됩니다.

> Note:  
> SSR을 Server Component와 헷갈리지 마세요. Server Component는 현재 실험적인 기능이며 여전히 연구중에 있습니다. 그리고 초기 React 18 릴리즈에는 포함되지 않을 것입니다. [여기서](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) Server Component를 배울 수 있습니다. Server Component는 SSR을 보완하고, data fetching 접근법중 추천되는 방법 중 하나입니다. 그러나 여기선 다루지 않습니다.

위에 접근 방식은 효과가 있지만 여러 면에서 최적이 아닙니다.

- 어떤 것을 표시하기 위해선 모든 것을 fetch 해야하는 것
- 어떤 것을 hydrate하기 위해선 모든 코드를 load 해야하는 것
- 어떤 것을 상호작용하기 위해선 모든 것에 hydrate 해야하는 것

React 18에선 위 문제를 해결하기 위해 `<Suspense>`를 사용합니다.

> 기존 Suspense는 Reacy.lazy를 이용한 Code Splitting에서만 사용되었습니다만 React 18에서는 Server Side에서도 잘 동작하며, 위 문제를 더 나은 방향으로 해결하는데 사용됩니다.

React 18에서 `<Suspense>`를 사용하면 앱을 작고 독립적인 단위로 나누어주어 위의 단계들에서 독립적으로 실행되도록 할 것입니다. 그래서 앱의 나머지 부분이 block되지 않도록 해줄 것입니다. 결과적으로 앱 사용자는 content를 더 빨리 보고 훨씬 더 빨리 상호작용할 수 있습니다.

또한 `React.lazy`가 SSR 환경에서 "작동"하게 된다는 것을 의미합니다.
(프레임워크를 사용하지 않는다면, 서버에서 HTML generate하는 부분을 바꿔야만 합니다.[예시](https://codesandbox.io/s/kind-sammet-j56ro?file=/server/render.js:1054-1614))

Suspense기능으로 인해 unlock된 React 18에서 2가지 중요한 feature가 있습니다.

- **Streaming HTML** on the server: switch `renderToString` to new `renderToPipeableStream`
- **Selective hydration** on the client: switch to new `hydrateRoot`. and wrapping parts of your app with `<Suspense>`

> 여담: server-side rendering 직접 만들어서 테스트해보려다가 배보다 배꼽이 더 커진 케이스랄까... 처음 React SSR 서버를 직접 작성(이라곤 하지만 구글에서 대부분 가져옴)해보았는데 상당히 버거운 느낌이었습니다.  
> 그래도 동작?은 되었고 Suspense가 server-side에서도 잘 동작하도록 업데이트 되었있는걸 확인했습니다. loadable-component와 같은 별도의 tool없이 Suspense SSR이 적용이 가능한 것을 확인했습니다.

**어떤 것을 표시하기 위해선 모든 것을 fetch 해야하는 것**

|  ![streaming](./images/streaming.png)  |
| :------------------------------------: |
| **모두 fetch하기 전에 HTML Streaming** |

**Streaming HTML**이 이 문제를 해결합니다.

```jsx
<Layout>
  <NavBar />
  <Sidebar />
  <RightPane>
    <Post />
    <Suspense fallback={<Spinner />}>
      <Comments />
    </Suspense>
  </RightPane>
</Layout>
```

Suspense를 통해 Comments가 완료되는지 안되는지 상관없이 HTML을 보낼 수 있습니다.
클라이언트는 처음 HTML을 받고 난 후부터 Comments가 만들어지기 까지 Suspense가 fallback에 선언해둔 component를 보여주게 되고, Comments가 완료된 시점에 추가 HTML을 동일 스트림으로 보내고 해당 HTML을 올바른 위치에 넣을 수 있게 작은 인라인 `<script>` 태그를 보내주어 올바른 위치에 넣게 해줍니다.

또한 기존 HTML Streaming 방식과 다르게 탑다운 순서로 진행될 필요도 없습니다.
데이터가 특정 순서에 맞춰 로드되어야 한다는 요구사항도 없습니다.

**어떤 것을 hydrate하기 위해선 모든 코드를 load 해야하는 것**

위 해결로 인해 초기 HTML을 더 일찍 보낼 수 있지만 여전히 문제가 있습니다. JavaScript 코드가 모두 로드될 때까지 클라이언트에서 hydration을 시작할 수 없습니다.

큰 번들 사이즈를 피하기 위해 주로 "코드 스플리팅"이 사용됩니다. 특정 코드 부분이 동기적으로 로드될 필요가 없다라고 명시해주면 번들러가 이를 별도의 `<script>`태크로 분할합니다.

React에서는 `React.lazy`를 이용하여 명시해줄 수 있고 메인 번들에서 `<Comments>`를 코드 스플리팅 할 수 있습니다.

```jsx
import { lazy } from 'react';

const Comments = lazy(() => import('./Comments.js'));

// ...

<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>;
```

이전에는 server rendering에서 작동하지 않았습니다. (우리가 아는한, 유명한 해결방법조차도 코드 스플리팅 component에 대해 SSR에서 제외하거나 그 코드가 모두 로드된 이후에 hydrate하는 것 중 하나를 선택하도록 강요하여 코드 스플리팅 목적을 다소 무력화했습니다.)

그러나 React 18에서는 `<Comments>`가 로드되기 전에 hydrate 할 수 있습니다.

| ![selective-hydrate](./images/selective-hydrate.png) |
| :--------------------------------------------------: |
|        **모든 코드가 load되기 전에 hydrate**         |

이것은 **Selective hydration**의 한 예입니다. `<Comments>`가 아직 로드되지 않았어도 나머지 부분이 hydrate하는 것을 막지 않습니다. 그 후 `<Comments>`가 로드되면 해당 부분을 hydrate하기 시작합니다.

selective hydration 덕분에 JavaScript의 페이지의 무거운 부분이 나머지 부분을 interactive되는 것을 막지 않습니다.

**어떤 것을 상호작용하기 위해선 모든 것에 hydrate 해야하는 것**

streaming HTML과 selective hydrateion으로 인해 hydrate 때문에 브라우저가 다른 작업을 수행하는 것을 더이상 차단하지 않습니다.

| ![interactive-hydrate](./images/interactive-hydrate.png) |
| :------------------------------------------------------: |
|     **모든 컴포넌트가 hydrate되기 전에 interactive**     |

React 18에서는 Suspense 내부의 hydrate는 브라우저가 이벤트를 처리할 수 있도록 작은 가격으로 발생합니다. 덕분에 클릭이 즉시 처리될 수 있고 low-end 장치에서도 오랜 hydrate 시간 때문에 브라우저가 멈춘 것처럼 보이지 않습니다. 예를 들어 사용자가 더 이상 관심이 없는 페이지에서 block때문에 더 이상 머무르지 않고 다른 곳으로 이동할 수 있습니다.

위의 예시는 `<Comments>` 부분만 Suspense로 wrapping되어 있어서 나머지 부분은 한 번에 hydrate됩니다. 더 많은 곳에서 Suspense를 사용하여 이 부분을 해결할 수 있습니다.

```jsx
<Layout>
  <NavBar />
  <Suspense fallback={<Spinner />}>
    <Sidebar />
  </Suspense>
  <RightPane>
    <Post />
    <Suspense fallback={<Spinner />}>
      <Comments />
    </Suspense>
  </RightPane>
</Layout>
```

Suspense를 제외한 부분이 초기 HTML에 포함되고 그 후 `<Sidebar>`, `<Comments>`가 hydrate됩니다. React는 두 개 모두 hydrate를 진행하는데 트리에서 앞부분에 있는 Suspense부터 진행합니다. 여기서는 `<Sidebar>`부터 진행됩니다.

| ![click-on-hydrating](./images/click-on-hydrating.png) |
| :----------------------------------------------------: |
|              click on hydrate `<Sidebar>`              |

그런데 만약 위 이미지처럼 `<Sidebar>`가 hydrate를 진행하고 있는 상태에서 `<Comments>` 영역에 상호작용(여기서는 클릭)을 한다고 가정해봅시다.

React는 해당 클릭 이벤트의 capture phase 동안에 `<Comments>`를 동기적으로 hydrate 할 것입니다.

> [이벤트 phase](https://www.seonest.net/posts/Javascript-eventing-deep-dive)

그 결과 `<Comments>`가 적시에 hydrate하여 상호작용에 응답할 수 있고 클릭 이벤트를 다루수 있게 됩니다. 그 후에 React는 긴급한(urgent) 작업이 없기 때문에 `<Sidebar>`를 hydrate 합니다.

이것은 우리 3번째 문제인 "어떤 것을 상호작용하기 위해선 모든 것에 hydrate 해야하는 것"을 해결합니다.

React는 가능한 빨리 모든 것을 hydrate하기 시작하고 사용자 상호작용에 기반한 화면의 가장 긴급한(urgent) 부분의 우선순위를 정합니다. 앱 전체에 Suspense를 채택한다면 그 경계가 더 세분화되기 때문에 Selective Hydration의 장점이 더 명확해질 것입니다.

| ![advance-hydrate](./images/advance-hydrate.png) |
| :----------------------------------------------: |
|                  more granualr                   |

> Note:  
> 완전하게 hydrate가 완료되지 않은 상태에서 앱이 어떻게 작동하는지 궁금할 수 있습니다.  
> 이것이 동작하도록 하는 디자인에는 몇 가지 세밀한 디테일이 있습니다.
>
> - 각각의 component가 개별적으로 hydration하지 않고 `<Suspense>` boundary 전체에 대해 hydration이 발생합니다.
> - `<Suspense>`는 바로 나타나지 않는 콘텐츠에 사용되기 때문에, 코드는 바로 사용할 수 없는 children에 탄력젹으로 작성가능합니다.
> - React는 항상 부모부터 hydrate되므로 component에는 항상 props를 가집니다.
> - React는 이벤트가 발생한 지점으로부터 부모tree 전체가 hydrate될 때까지 이벤트 전달을 보류합니다.
> - React는 만약 parent가 not-yet-hydrated HTML을 stale하게 만드는 방식으로 업데이트된다면 해당 부분이 load될 때까지 이를 숨기고 지정된 `fallback`을 보여줍니다.
>
> 이렇게 하면 트리가 사용자에게 일관되게 나타납니다.

---

**결론적으로**

React 18은 SSR에 2가지 주요 기능을 제공합니다.

- **Streaming HTML**: 원하는 즉시 HTML을 내보내고 적절한 위치에 배치되어 추가 콘텐츠에 대한 HTML을 Streaming할 수 있습니다.
- **Selective Hydration**: 초기 이후의 HTML, JavaScript 코드가 완전히 다운로드 되기 전에 최대한 빨리 앱에 hydratation을 시작할 수 있습니다. 또한 사용자가 상호작용하는 부분에 우선순위를 두어 즉각적인 hydration의 환상을 만듭니다.

`<Suspense>` 컴포넌트는 이 모든 기능을 가지고 있습니다.
React 내부에서 자동으로 이루어지며 대부분의 기존 React 코드와 함께 작동할 것으로 기대합니다. 이것은 loading state를 선언적으로 표현하는 힘을 보여줍니다.

`if (isloading)`에서 `<Suspense>`로 바꾸는 것이 큰 차이로 보이진 않지만, 이러한 모든 개선사항을 잠금해제하는 중요한 변화입니다.
