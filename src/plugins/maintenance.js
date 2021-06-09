const R = require('ramda');
const { differenceInDays, formatDistanceToNow } = require('date-fns');
const { createWarning } = require('../lib/result');
const { stringBuilder, success, warning } = require('../lib/format');
const { fetchGithub } = require('../lib/fetch');

const SIX_MONTHS = 183; // in days

const maintenancePlugin = async (pkg, _, options) => {
  const githubTarget = pkg.repository.url
    .split('github.com/')[1]
    .replace('.git', '');

  const output = stringBuilder('\nChecking maintenance metrics').withPadding(
    66
  );

  const releases = await fetchGithub(
    `/repos/${githubTarget}/releases`,
    options.githubToken
  );
  const latestRelease = R.head(releases);

  if (!latestRelease) {
    warning(output.get());
    return createWarning(`No releases found for the ${pkg.name} module`);
  }

  const now = new Date();
  const releaseDate = new Date(latestRelease?.published_at);

  const difference = differenceInDays(now, releaseDate);

  if (difference > SIX_MONTHS) {
    warning(output.get());
    const distance = formatDistanceToNow(releaseDate);
    const reason = `The latest release of "${pkg.name}" was ${distance} ago`;
    return createWarning(reason);
  }

  success(output.get());
  return null;
};

module.exports = maintenancePlugin;
