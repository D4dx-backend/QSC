import React from "react";

const Skeleton = ({ className }) => <div className={`animate-pulse bg-gray-50 rounded ${className}`}></div>;

const SingleRowSkeleton = ({ showSpeakers = false }) => (
  <div className="bg-white  rounded-xl p-4 mb-4">
    <div className="flex items-center justify-between">
      <div className="space-y-4 flex-1">
        {/* Title and Tag */}
        <div className="flex items-center space-x-3">
          <Skeleton className="h-6 w-48" /> {/* Title */}
          <Skeleton className="h-6 w-20 rounded-full" /> {/* Keynote tag */}
        </div>

        {/* Date, Time, Location */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5" /> {/* Calendar icon */}
            <Skeleton className="h-5 w-32" /> {/* Date */}
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5" /> {/* Clock icon */}
            <Skeleton className="h-5 w-36" /> {/* Time */}
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5" /> {/* Location icon */}
            <Skeleton className="h-5 w-24" /> {/* Stage */}
          </div>
        </div>
      </div>

      {/* Right side - Either speakers or action buttons */}
      <div className="flex items-center space-x-3">
        {showSpeakers ? (
          <>
            <div className="flex items-center -space-x-2">
              <Skeleton className="h-8 w-8 rounded-full -2 -white" />
              <Skeleton className="h-8 w-8 rounded-full -2 -white" />
            </div>
            <Skeleton className="h-8 w-16 rounded" /> {/* Edit button */}
          </>
        ) : (
          <>
            <Skeleton className="h-8 w-16 rounded" /> {/* Edit button */}
            <Skeleton className="h-8 w-32 rounded" /> {/* Assign Speaker button */}
          </>
        )}
      </div>
    </div>
  </div>
);
const CardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm  p-4 relative">
    {/* Delete Button */}
    <div className="absolute top-4 right-4">
      <Skeleton className="h-6 w-16 rounded" />
    </div>

    {/* Logo/Image */}
    <div className="flex left mb-4">
      <Skeleton className="h-16 w-32 rounded-lg" />
    </div>

    {/* Title */}
    <div className="mb-6">
      <Skeleton className="h-6  mx-auto" />
    </div>

    {/* Details Section */}
    <div className="space-y-6">
      {/* Start Date */}
      <div className="space-y-1">
        <Skeleton className="h-4 w-20 mb-2" /> {/* Label */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5" /> {/* Calendar Icon */}
          <Skeleton className="h-5 w-32" /> {/* Date */}
        </div>
      </div>

      {/* End Date */}
      <div className="space-y-1">
        <Skeleton className="h-4 w-20 mb-2" /> {/* Label */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5" /> {/* Calendar Icon */}
          <Skeleton className="h-5 w-32" /> {/* Date */}
        </div>
      </div>

      {/* Venue */}
      <div className="space-y-1">
        <Skeleton className="h-4 w-20 mb-2" /> {/* Label */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5" /> {/* Location Icon */}
          <Skeleton className="h-5 w-32" /> {/* Venue */}
        </div>
      </div>
    </div>
  </div>
);

const SessionRowSkeleton = ({ showSpeakers = false }) => (
  <div className="bg-white rounded-lg p-0">
    <div className="flex items-center justify-between">
      <div className="space-y-4 flex-1">
        {/* Title and Tag */}
        <div className="flex items-center space-x-3">
          <Skeleton className="h-6 w-48" /> {/* Title */}
          <Skeleton className="h-6 w-20 rounded-full" /> {/* Keynote tag */}
        </div>

        {/* Date, Time, Location */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5" /> {/* Calendar icon */}
            <Skeleton className="h-5 w-32" /> {/* Date */}
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5" /> {/* Clock icon */}
            <Skeleton className="h-5 w-36" /> {/* Time */}
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5" /> {/* Location icon */}
            <Skeleton className="h-5 w-24" /> {/* Stage */}
          </div>
        </div>
      </div>

      {/* Right side - Either speakers or action buttons */}
      <div className="flex items-center space-x-3">
        {showSpeakers ? (
          <>
            <div className="flex items-center -space-x-2">
              <Skeleton className="h-8 w-8 rounded-full -2 -white" />
              <Skeleton className="h-8 w-8 rounded-full -2 -white" />
            </div>
            <Skeleton className="h-8 w-16 rounded" /> {/* Edit button */}
          </>
        ) : (
          <>
            <Skeleton className="h-8 w-16 rounded" /> {/* Edit button */}
            <Skeleton className="h-8 w-32 rounded" /> {/* Assign Speaker button */}
          </>
        )}
      </div>
    </div>
  </div>
);
const StatCardSkeleton = () => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-10 w-10 rounded-lg" /> {/* Icon */}
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-32" /> {/* Title */}
        <Skeleton className="h-6 w-24" /> {/* Value */}
      </div>
    </div>
  </div>
);

const ChartSkeleton = ({ height = "h-[300px]" }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="space-y-6">
      <Skeleton className="h-6 w-48" /> {/* Chart Title */}
      <div className={`${height} w-full`}>
        <Skeleton className="h-full w-full rounded-lg" /> {/* Chart Area */}
      </div>
    </div>
  </div>
);
export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, idx) => (
        <StatCardSkeleton key={idx} />
      ))}
    </div>

    {/* Charts Grid - First Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton height="h-[400px]" />
      <ChartSkeleton height="h-[400px]" />
    </div>

    {/* Charts Grid - Second Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton height="h-[400px]" />
      <ChartSkeleton height="h-[400px]" />
    </div>
  </div>
);
export const ListTableSkeleton = ({ viewMode = "table", displayColumn = "single", tableColumnCount = 5 }) => {
  // Simple list view (single column)
  if (viewMode === "simple") {
    return (
      <div className="p-0 space-y-4">
        <SessionRowSkeleton showSpeakers={true} />
        <SessionRowSkeleton showSpeakers={false} />
        <SessionRowSkeleton showSpeakers={false} />
      </div>
    );
  }

  // Card grid view
  if (viewMode === "list" || viewMode === "subList") {
    return (
      <div className="p-0">
        <div className={displayColumn === "triple" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "grid grid-cols-1"}>{displayColumn === "triple" ? [...Array(9)].map((_, idx) => <CardSkeleton key={idx} />) : [...Array(8)].map((_, idx) => <SingleRowSkeleton key={idx} />)}</div>
      </div>
    );
  }

  // Table view
  return (
    <div className="p-0">
      <div className="space-y-4">
        {/* Table Header */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>

        {/* Table Rows */}
        {[...Array(10)].map((_, rowIdx) => (
          <div key={rowIdx} className="flex space-x-4">
            <Skeleton className="mt-5 h-1 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SubpageSkeleton = () => (
  <>
    {/* Desktop Skeleton - Hidden on Mobile */}
    <div className="hidden sm:flex h-screen w-full">
      {/* Sidebar Navigation - exactly 80px width */}
      <div className="w-20 min-w-[80px] max-w-[80px] bg-white border-r border-gray-100 flex flex-col items-center py-6 space-y-8">
        <Skeleton className="h-12 w-12 rounded-lg mb-6" /> {/* Logo */}
        {/* Navigation Icons with text below - each max-width 80px */}
        <div className="flex flex-col items-center justify-center space-y-8 w-full">
          <div className="flex flex-col items-center w-full">
            <Skeleton className="h-6 w-6 rounded mb-2" /> {/* Dashboard icon */}
            <Skeleton className="h-3 w-16 rounded" /> {/* Dashboard text */}
          </div>

          <div className="flex flex-col items-center w-full">
            <Skeleton className="h-6 w-6 rounded mb-2" /> {/* Configure icon */}
            <Skeleton className="h-3 w-16 rounded" /> {/* Configure text */}
          </div>

          <div className="flex flex-col items-center w-full">
            <Skeleton className="h-6 w-6 rounded mb-2" /> {/* Registration icon */}
            <Skeleton className="h-3 w-16 rounded" /> {/* Registration text */}
          </div>

          <div className="flex flex-col items-center w-full">
            <Skeleton className="h-6 w-6 rounded mb-2" /> {/* Exhibitors icon */}
            <Skeleton className="h-3 w-16 rounded" /> {/* Exhibitors text */}
          </div>

          <div className="flex flex-col items-center w-full">
            <Skeleton className="h-6 w-6 rounded mb-2" /> {/* Marketing icon */}
            <Skeleton className="h-3 w-16 rounded" /> {/* Marketing text */}
          </div>

          <div className="flex flex-col items-center w-full">
            <Skeleton className="h-6 w-6 rounded mb-2" /> {/* Reports icon */}
            <Skeleton className="h-3 w-16 rounded" /> {/* Reports text */}
          </div>

          <div className="flex flex-col items-center w-full">
            <Skeleton className="h-6 w-6 rounded mb-2" /> {/* Add Ons icon */}
            <Skeleton className="h-3 w-16 rounded" /> {/* Add Ons text */}
          </div>

          <div className="flex flex-col items-center w-full">
            <Skeleton className="h-6 w-6 rounded mb-2" /> {/* Insta Snap icon */}
            <Skeleton className="h-3 w-16 rounded" /> {/* Insta Snap text */}
          </div>
        </div>
      </div>

      {/* Main Content - takes up remaining width (100% - 80px) */}
      <div className="flex-1 p-6 bg-white">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-14 w-14 rounded-md" /> {/* Header image */}
            <div>
              <Skeleton className="h-7 w-72 mb-1" /> {/* Title */}
              <Skeleton className="h-5 w-44" /> {/* Date */}
            </div>
          </div>
          <Skeleton className="h-9 w-9 rounded-full" /> {/* Action button */}
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-2 px-4">
            <Skeleton className="h-5 w-24" /> {/* Registration tab */}
          </div>
          <div className="bg-white shadow-sm rounded-lg p-2 px-4">
            <Skeleton className="h-5 w-24" /> {/* Attendance tab */}
          </div>
          <div className="flex-1"></div>
          <div className="bg-gray-50 rounded-md p-2 px-4">
            <Skeleton className="h-5 w-10" /> {/* Edit button */}
          </div>
        </div>

        {/* Stats/Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Registration */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-gray-50 p-3 rounded-full">
                <Skeleton className="h-6 w-6 rounded" /> {/* Clipboard icon */}
              </div>
              <div className="ml-3">
                <Skeleton className="h-5 w-36" /> {/* Total Registration */}
              </div>
            </div>
            <div className="text-left">
              <Skeleton className="h-9 w-5" /> {/* Value: 0 */}
            </div>
          </div>

          {/* Card 2: Today's Registration */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-gray-50 p-3 rounded-full">
                <Skeleton className="h-6 w-6 rounded" /> {/* Calendar icon */}
              </div>
              <div className="ml-3">
                <Skeleton className="h-5 w-40" /> {/* Today's Registration */}
              </div>
            </div>
            <div className="text-left">
              <Skeleton className="h-9 w-5" /> {/* Value: 0 */}
            </div>
          </div>

          {/* Card 3: Total Ticket Amount */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-gray-50 p-3 rounded-full">
                <Skeleton className="h-6 w-6 rounded" /> {/* Dollar icon */}
              </div>
              <div className="ml-3">
                <Skeleton className="h-5 w-36" /> {/* Total Ticket Amount */}
              </div>
            </div>
            <div className="text-left">
              <Skeleton className="h-9 w-20" /> {/* Value: 0.00 */}
            </div>
          </div>

          {/* Card 4: Avg Ticket Amount */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-gray-50 p-3 rounded-full">
                <Skeleton className="h-6 w-6 rounded" /> {/* Ticket icon */}
              </div>
              <div className="ml-3">
                <Skeleton className="h-5 w-36" /> {/* Avg Ticket Amount */}
              </div>
            </div>
            <div className="text-left">
              <Skeleton className="h-9 w-20" /> {/* Value: 0.00 */}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Mobile Skeleton - Only visible on mobile */}
    <div className="sm:hidden min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-8 rounded" /> {/* Menu icon */}
          <Skeleton className="h-8 w-32" /> {/* Logo */}
          <Skeleton className="h-8 w-8 rounded-full" /> {/* Profile */}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" /> {/* Title */}
          <Skeleton className="h-4 w-1/2" /> {/* Subtitle */}
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="p-4 flex space-x-3">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>

      {/* Mobile Stats Cards */}
      <div className="p-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

export const MinimalLandingPageSkeleton = () => (
  <div className="min-h-screenmin-h-dvh bg-gray-50">
    {/* Header with Logo and Register Button */}
    <header className="bg-white -b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Area */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-10 rounded-full" /> {/* Logo icon        <Skeleton className="h-6 w-48" /> {/* Logo text */}
          </div>
          {/* Register Button */}
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    </header>

    {/* Main Banner */}
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Banner Content */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {/* Institute Name */}
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>

          {/* Main Event Title/Banner */}
          <div className="aspect-video max-w-3xl mx-auto">
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default ListTableSkeleton;
