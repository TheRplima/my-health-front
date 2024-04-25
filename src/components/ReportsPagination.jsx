import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

const ReportsPagination = (props) => {

    const paginationData = props.paginationData;

    let items = [];
    if (paginationData?.links?.length > 0) {
        paginationData.links.map((link, index) => {
            //ignore the fisrt and last item and add elipsys on multiple of 5
            if (index === 0) {
                const prevDisabled = paginationData.prev_page_url && paginationData.prev_page_url !== paginationData.first_page_url ? false : true;
                items.push(<Pagination.Prev key={index} href={link.url} active={link.active} disabled={prevDisabled} onClick={(event) => props.paginationClicked(event, link.active)} />)
            }
            if (index === paginationData.links.length - 1) {
                const nextDisabled = paginationData.next_page_url && paginationData.next_page_url !== paginationData.last_page_url ? false : true;
                items.push(<Pagination.Next key={index} href={link.url} active={link.active} disabled={nextDisabled} onClick={(event) => props.paginationClicked(event, link.active)} />)
            }
            if (index !== 0 && index !== paginationData.links.length - 1) {
                if (index % 5 === 0) {
                    items.push(<Pagination.Ellipsis key={index} />);
                } else {
                    items.push(<Pagination.Item key={index} href={link.url} active={link.active} onClick={(event) => props.paginationClicked(event, link.active)}>{link.label}</Pagination.Item>);
                }
            }
        });
    }

    const first = {
        url: paginationData.first_page_url,
        disabled: paginationData.current_page === 1 ? true : false
    }
    const last = {
        url: paginationData.last_page_url,
        disabled: paginationData.current_page === paginationData.last_page ? true : false
    }

    return (
        <Pagination>
            <Pagination.First href={first.url} disabled={first.disabled} onClick={(event) => props.paginationClicked(event, first.disabled)} />
            {items}
            <Pagination.Last href={last.url} disabled={last.disabled} onClick={(event) => props.paginationClicked(event, last.disabled)} />
        </Pagination>
    );
};

export default ReportsPagination;