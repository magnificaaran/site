import React, { FC, useRef, useState } from 'react';
import { JobEntry } from '../../../bcms/types';
import ContentManager from '@/components/ContentManager';
import JobsCard from '@/components/jobs/Card';
import Search from '@/components/Search';
import Dropdown from '@/components/Dropdown';
import Btn from '@/components/Btn';
import { BCMSPropRichTextDataParsed } from '@becomes/cms-client/types';

interface HomeJobsProps {
  data: {
    title: string;
    description: BCMSPropRichTextDataParsed;
  };
  jobs: {
    nodes: Array<{
      bcms: JobEntry;
    }>;
  };
}

const HomeJobs: FC<HomeJobsProps> = ({ data, jobs }) => {
  const sectionDOM = useRef<HTMLElement>(null);

  const paginationPage = useRef(1);
  const jobsPerPage = useRef(9);

  const [searchValue, setSearchValue] = useState('');
  const [jobTypeValue, setJobTypeValue] = useState('');
  const [locationValue, setLocationValue] = useState('');

  const filteredJobs = jobs.nodes.filter((e) => {
    let show: boolean | undefined = true;

    if (searchValue.length) {
      show =
        show &&
        `${e.bcms.meta.en?.title} ${e.bcms.meta.en?.description}`
          .toLowerCase()
          .includes(searchValue.toLowerCase());
    }
    if (jobTypeValue.length) {
      show =
        show && e.bcms.meta.en?.type.jobType.meta.en?.title === jobTypeValue;
    }

    if (locationValue.length) {
      show =
        show &&
        e.bcms.meta.en?.location.jobLocation.meta.en?.title
          .toLowerCase()
          .includes(locationValue.toLowerCase());
    }

    return show;
  });

  const paginatedJobs = filteredJobs.slice(
    0,
    paginationPage.current * jobsPerPage.current,
  );

  const loadMore = () => {
    paginationPage.current++;
  };

  const scrollToTop = () => {
    if (sectionDOM.current) {
      window.scrollTo({
        top: sectionDOM.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="homeJobs"
      ref={sectionDOM}
      className="py-12 md:py-20 lg:py-[120px]"
    >
      <div className="container">
        <h2 className="text-2xl leading-[1.2] font-medium text-center font-PlayfairDisplay tracking-[-0.41px] max-w-[258px] mx-auto mb-4 md:text-3xl md:max-w-[300px] lg:text-5xl lg:leading-[1.2] lg:max-w-[525px] lg:mb-5">
          {data.title}
        </h2>
        <ContentManager
          item={data.description}
          className="text-sm leading-[1.4] font-medium tracking-[-0.41px] text-appGray-600 text-center max-w-[280px] mx-auto mb-8 lg:text-base lg:leading-normal lg:max-w-[402px] lg:mb-16"
        />
        <div className="grid grid-cols-2 gap-x-[14px] mb-8 lg:grid-cols-3 lg:gap-8 lg:mb-10">
          <Search
            value={searchValue}
            options={jobs.nodes.map((e) => ({ title: e.bcms.meta.en?.title }))}
            className="col-span-2 lg:col-span-1"
            onInput={(value) => setSearchValue(value)}
          />
          <Dropdown
            value={jobTypeValue}
            options={jobs.nodes.map(
              (e) => e.bcms.meta.en?.type.jobType.meta.en?.title,
            )}
            placeholder="Job type..."
            icon={true}
            onChange={(value: string) => setJobTypeValue(value)}
          />
          <Search
            value={locationValue}
            options={jobs.nodes.map((e) => e.bcms.meta.en?.title)}
            icon={true}
            placeholder="Location"
            onInput={(value) => setLocationValue(value)}
          />
        </div>
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {paginatedJobs.map((card, index) => (
              <JobsCard key={index} card={card} />
            ))}
            <div className="flex flex-col justify-center items-center md:col-span-2 md:mt-6 lg:col-span-3">
              {paginatedJobs.length < filteredJobs.length && (
                <Btn
                  theme="accent-outline"
                  size="sm"
                  className="justify-center w-full max-md:mb-4 md:max-w-max"
                  onClick={loadMore}
                >
                  <span>Load more jobs</span>
                </Btn>
              )}
              {filteredJobs.length >= 5 && (
                <Btn
                  theme="dark"
                  size="sm"
                  className="justify-center w-full md:hidden"
                  onClick={scrollToTop}
                >
                  <span>Back to top</span>
                </Btn>
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center text-sm leading-none font-medium tracking-[-0.41px] text-appGray-500">
            There are no jobs for the applied filters
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeJobs;
