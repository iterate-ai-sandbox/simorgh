import { FetchMock } from 'jest-fetch-mock';
import React from 'react';
import assocPath from 'ramda/src/assocPath';
import pashtoPageData from '#data/pashto/bbc_pashto_tv/tv_programmes/w13xttn4.json';
import * as analyticsUtils from '#lib/analyticsUtils';
import getInitialData from '#app/routes/onDemandTV/getInitialData';
import withMediaError from '#lib/utilities/episodeAvailability/withMediaError';
import { MEDIA_PAGE } from '#app/routes/utils/pageTypes';
import { Services } from '#app/models/types/global';
import {
  act,
  render,
} from '../../components/react-testing-library-with-providers';
import * as MediaLoader from '../../components/MediaLoader';
import _OnDemandTvPage, { OnDemandTVProps } from './OnDemandTvPage';

const pageType = MEDIA_PAGE;

const OnDemandTvPage = withMediaError(_OnDemandTvPage);

const toggles = {
  recentVideoEpisodes: {
    enabled: false,
    value: 4,
  },
};

interface Props {
  pageData: OnDemandTVProps['pageData'];
  service: Services;
}

const renderPage = async ({ pageData, service }: Props) => {
  let result;
  await act(async () => {
    result = render(<OnDemandTvPage service={service} pageData={pageData} />, {
      bbcOrigin: 'https://www.test.bbc.com',
      derivedPageType: 'On Demand TV',
      pageType,
      pathname: '/pathname',
      service,
      statusCode: 200,
    });
  });

  return result;
};

(analyticsUtils.getAtUserId as jest.Mock) = jest.fn();

const fetchMock = fetch as FetchMock;

jest.mock('../../components/ChartbeatAnalytics', () => {
  const ChartbeatAnalytics = () => <div>chartbeat</div>;
  return ChartbeatAnalytics;
});

const { env } = process;

describe('OnDemand TV Brand Page ', () => {
  beforeEach(() => {
    process.env = { ...env };
  });

  it('a11y - should render a visually hidden headline', async () => {
    fetchMock.mockResponse(JSON.stringify(pashtoPageData));

    const { pageData } = await getInitialData({
      path: 'some-ondemand-tv-path',
      pageType,
      toggles,
    });
    await renderPage({
      // @ts-expect-error partial data required for testing purposes
      pageData,
      service: 'pashto',
    });

    const visuallyHiddenHeadline = document.querySelector(
      'h1[class*="visuallyHiddenText"]',
    );

    expect(visuallyHiddenHeadline).toBeInTheDocument();
    expect(visuallyHiddenHeadline?.innerHTML).toEqual('نړۍ دا وخت, ۲۷ می ۲۰۲۰');
  });

  it('should show the brand title for OnDemand TV Pages', async () => {
    fetchMock.mockResponse(JSON.stringify(pashtoPageData));

    const { pageData } = await getInitialData({
      path: 'some-ondemand-tv-path',
      pageType,
      toggles,
    });
    // @ts-expect-error react testing library returns the required query
    const { getByText } = await renderPage({
      // @ts-expect-error partial data required for testing purposes
      pageData,
      service: 'pashto',
    });

    expect(getByText('نړۍ دا وخت')).toBeInTheDocument();
  });

  it('a11y - should aria-hide the title', async () => {
    fetchMock.mockResponse(JSON.stringify(pashtoPageData));

    const { pageData } = await getInitialData({
      path: 'some-ondemand-tv-path',
      pageType,
      toggles,
    });
    // @ts-expect-error react testing library returns the required query
    const { container } = await renderPage({
      // @ts-expect-error partial data required for testing purposes
      pageData,
      service: 'pashto',
    });

    const hiddenHeadline = container.querySelector('strong[aria-hidden=true]');

    expect(hiddenHeadline).toBeDefined();
    expect(hiddenHeadline).toContainHTML('نړۍ دا وخت');
  });

  it('a11y - should have a "content" id on the h1', async () => {
    fetchMock.mockResponse(JSON.stringify(pashtoPageData));

    const { pageData } = await getInitialData({
      path: 'some-ondemand-tv-path',
      pageType,
      toggles,
    });
    // @ts-expect-error react testing library returns the required query
    const { container } = await renderPage({
      // @ts-expect-error partial data required for testing purposes
      pageData,
      service: 'pashto',
    });

    expect(container.querySelector('h1#content')).toBeDefined();
  });

  it('Dark Mode Design - should match snapshot', async () => {
    fetchMock.mockResponse(JSON.stringify(pashtoPageData));

    const { pageData } = await getInitialData({
      path: 'some-ondemand-tv-path',
      pageType,
      toggles,
    });
    // @ts-expect-error react testing library returns the required query
    const { container } = await renderPage({
      // @ts-expect-error partial data required for testing purposes
      pageData,
      service: 'pashto',
    });

    expect(container).toMatchSnapshot();
  });

  it('should show the datestamp correctly for Pashto OnDemand TV Pages', async () => {
    fetchMock.mockResponse(JSON.stringify(pashtoPageData));

    const { pageData } = await getInitialData({
      path: 'some-ondemand-tv-path',
      pageType,
      toggles,
    });
    // @ts-expect-error react testing library returns the required query
    const { getByText } = await renderPage({
      // @ts-expect-error partial data required for testing purposes
      pageData,
      service: 'pashto',
    });

    expect(getByText('۲۷ می ۲۰۲۰')).toBeInTheDocument();
  });

  it('should show the summary for OnDemand TV Pages', async () => {
    fetchMock.mockResponse(JSON.stringify(pashtoPageData));

    const { pageData } = await getInitialData({
      path: 'some-ondemand-tv-path',
      pageType,
      toggles,
    });
    // @ts-expect-error react testing library returns the required query
    const { getByText } = await renderPage({
      // @ts-expect-error partial data required for testing purposes
      pageData,
      service: 'pashto',
    });

    expect(
      getByText(
        'د بي بي سي پښتو ټلویزیوني خپرونه چې هره ورځ د افغانستان په شپږ بجو په ژوندۍ بڼه خپرېږي. دلته یې لیدلی شئ.',
      ),
    ).toBeInTheDocument();
  });

  it('should show the video player', async () => {
    process.env.SIMORGH_APP_ENV = 'live';
    fetchMock.mockResponse(JSON.stringify(pashtoPageData));
    const { pageData } = await getInitialData({
      path: 'some-ondemand-tv-path',
      pageType,
      toggles,
    });
    // @ts-expect-error react testing library returns the required query
    const { container } = await renderPage({
      // @ts-expect-error partial data required for testing purposes
      pageData,
      service: 'pashto',
    });

    const videoPlayer = container.querySelector(
      '[data-e2e="media-loader__container"]',
    );

    expect(videoPlayer).toBeInTheDocument();
  });

  it('should use the derived page identifier to render the video player', async () => {
    const mediaLoaderSpy = jest.spyOn(MediaLoader, 'default');

    process.env.SIMORGH_APP_ENV = 'live';
    fetchMock.mockResponse(JSON.stringify(pashtoPageData));
    const { pageData } = await getInitialData({
      path: 'some-ondemand-tv-path',
      pageType,
      toggles,
    });

    await renderPage({
      // @ts-expect-error partial data required for testing purposes
      pageData,
      service: 'pashto',
    });

    const mediaLoaderProps = mediaLoaderSpy.mock.calls[0][0];
    const { pageIdentifierOverride } = mediaLoaderProps;

    expect(mediaLoaderSpy).toHaveBeenCalled();
    expect(pageIdentifierOverride).toEqual(
      'pashto.bbc_pashto_tv.tv.w172xcldhhrdqgb.page',
    );
  });

  it('should show the expired content message if episode is expired', async () => {
    const pageDataWithExpiredEpisode = assocPath(
      ['content', 'blocks', 0, 'availability'],
      'notAvailable',
      pashtoPageData,
    );
    fetchMock.mockResponse(JSON.stringify(pageDataWithExpiredEpisode));
    const { pageData } = await getInitialData({
      path: 'some-ondemand-tv-path',
      pageType,
      toggles,
    });
    // @ts-expect-error react testing library returns the required queries
    const { container, getByText } = await renderPage({
      // @ts-expect-error partial data required for testing purposes
      pageData,
      service: 'pashto',
    });
    const audioPlayerIframeEl = container.querySelector('iframe');
    const expiredMessageEl = getByText('دغه فایل نور د لاسرسي وړ نه دی.');

    expect(audioPlayerIframeEl).not.toBeInTheDocument();
    expect(expiredMessageEl).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should show the future content message if episode is not yet available', async () => {
    const pageDataWithFutureEpisode = assocPath(
      ['content', 'blocks', 0, 'availability'],
      'future',
      pashtoPageData,
    );
    fetchMock.mockResponse(JSON.stringify(pageDataWithFutureEpisode));
    const { pageData } = await getInitialData({
      path: 'some-ondemand-tv-path',
      pageType,
      toggles,
    });
    // @ts-expect-error react testing library returns the required queries
    const { container, getByText } = await renderPage({
      // @ts-expect-error partial data required for testing purposes
      pageData,
      service: 'pashto',
    });
    const audioPlayerIframeEl = container.querySelector('iframe');
    const notYetAvailableEl = getByText(
      'دغه پروګرام د خپرولو لپاره چمتو نه دی.',
    );

    expect(audioPlayerIframeEl).not.toBeInTheDocument();
    expect(notYetAvailableEl).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should show the future content message if episode is pending', async () => {
    const pageDataWithFutureEpisode = assocPath(
      ['content', 'blocks', 0, 'availability'],
      'pending',
      pashtoPageData,
    );
    fetchMock.mockResponse(JSON.stringify(pageDataWithFutureEpisode));
    const { pageData } = await getInitialData({
      path: 'some-ondemand-tv-path',
      pageType,
      toggles,
    });
    // @ts-expect-error react testing library returns the required queries
    const { container, getByText } = await renderPage({
      // @ts-expect-error partial data required for testing purposes
      pageData,
      service: 'pashto',
    });
    const audioPlayerIframeEl = container.querySelector('iframe');
    const notYetAvailableEl = getByText(
      'دغه پروګرام د خپرولو لپاره چمتو نه دی.',
    );

    expect(audioPlayerIframeEl).not.toBeInTheDocument();
    expect(notYetAvailableEl).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
